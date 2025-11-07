/**
 * Two-Factor Authentication Controller
 * Handles HTTP requests for 2FA setup, verification, and management
 */

import { Request, Response } from 'express';
import { twoFactorService } from '../services/twoFactorService.js';
import { twoFactorModel } from '../models/twoFactorModel.js';
import { logger } from '../utils/logger.js';
import {
  TwoFactorSetupRequest,
  TwoFactorEnableRequest,
  TwoFactorVerifyRequest,
  TwoFactorDisableRequest,
  RegenerateBackupCodesRequest,
} from '../types/auth.js';
import bcrypt from 'bcryptjs';

/**
 * Initialize 2FA setup
 * Generates TOTP secret, QR code, and backup codes
 * POST /api/auth/2fa/setup
 */
export const setup2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userEmail = (req as any).user?.email;

    if (!userId || !userEmail) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated',
      });
      return;
    }

    // Check if 2FA is already enabled
    const status = await twoFactorModel.getTwoFactorStatus(userId);
    if (status?.two_factor_enabled) {
      res.status(400).json({
        success: false,
        message: '2FA is already enabled. Disable it first to re-setup.',
      });
      return;
    }

    // Generate TOTP secret and backup codes
    const setupData = await twoFactorService.generateTOTPSecret(userEmail);

    logger.info('2FA setup initiated', { userId, email: userEmail });

    res.status(200).json(setupData);
  } catch (error) {
    logger.error('Error in setup2FA controller', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize 2FA setup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Enable 2FA (complete setup)
 * Verifies TOTP token and saves secret + backup codes
 * POST /api/auth/2fa/enable
 */
export const enable2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { secret, token, backupCodes }: TwoFactorEnableRequest = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Validate inputs
    if (!secret || !token || !backupCodes || !Array.isArray(backupCodes)) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: secret, token, backupCodes',
      });
      return;
    }

    // Verify TOTP token
    const isValid = twoFactorService.verifyTOTPToken(secret, token);
    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please try again.',
        twoFactorEnabled: false,
      });
      return;
    }

    // Hash backup codes for secure storage
    const hashedBackupCodes = twoFactorService.hashBackupCodes(backupCodes);

    // Save to database
    const success = await twoFactorModel.enableTwoFactor(userId, secret, hashedBackupCodes);

    if (!success) {
      res.status(500).json({
        success: false,
        message: 'Failed to enable 2FA',
        twoFactorEnabled: false,
      });
      return;
    }

    logger.info('2FA enabled successfully', { userId });

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully',
      twoFactorEnabled: true,
    });
  } catch (error) {
    logger.error('Error in enable2FA controller', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable 2FA',
      twoFactorEnabled: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Verify 2FA token (during login or for operations)
 * POST /api/auth/2fa/verify
 */
export const verify2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, token, isBackupCode }: TwoFactorVerifyRequest = req.body;

    if (!email || !token) {
      res.status(400).json({
        success: false,
        message: 'Email and token are required',
        valid: false,
      });
      return;
    }

    // Get user ID
    const userId = await twoFactorModel.getUserIdByEmail(email);
    if (!userId) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        valid: false,
      });
      return;
    }

    let isValid = false;
    let remainingBackupCodes: number | undefined;

    if (isBackupCode) {
      // Verify backup code
      const hashedCodes = await twoFactorModel.getBackupCodesByEmail(email);
      const result = twoFactorService.verifyBackupCode(token, hashedCodes);

      isValid = result.isValid;

      if (isValid) {
        // Update backup codes in database (remove used code)
        await twoFactorModel.updateBackupCodes(userId, result.remainingCodes);
        remainingBackupCodes = result.remainingCodes.length;

        logger.info('Backup code verified', {
          userId,
          remainingCodes: remainingBackupCodes,
        });
      }
    } else {
      // Verify TOTP token
      const secret = await twoFactorModel.getTOTPSecretByEmail(email);

      if (!secret) {
        res.status(400).json({
          success: false,
          message: '2FA not enabled for this user',
          valid: false,
        });
        return;
      }

      isValid = twoFactorService.verifyTOTPToken(secret, token);

      if (isValid) {
        logger.info('TOTP verified successfully', { userId });
      }
    }

    res.status(200).json({
      success: true,
      message: isValid ? 'Verification successful' : 'Invalid code',
      valid: isValid,
      remainingBackupCodes,
    });
  } catch (error) {
    logger.error('Error in verify2FA controller', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA code',
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Disable 2FA
 * POST /api/auth/2fa/disable
 */
export const disable2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { password, token }: TwoFactorDisableRequest = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required to disable 2FA',
      });
      return;
    }

    // Verify password (fetch user password hash)
    const [rows]: any = await require('../config/database').pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
      return;
    }

    // If token provided, verify it
    if (token) {
      const secret = await twoFactorModel.getTOTPSecret(userId);
      if (secret) {
        const isTokenValid = twoFactorService.verifyTOTPToken(secret, token);
        if (!isTokenValid) {
          res.status(400).json({
            success: false,
            message: 'Invalid 2FA token',
          });
          return;
        }
      }
    }

    // Disable 2FA
    const success = await twoFactorModel.disableTwoFactor(userId);

    if (!success) {
      res.status(500).json({
        success: false,
        message: 'Failed to disable 2FA',
        twoFactorEnabled: true,
      });
      return;
    }

    logger.info('2FA disabled', { userId });

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully',
      twoFactorEnabled: false,
    });
  } catch (error) {
    logger.error('Error in disable2FA controller', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get 2FA status
 * GET /api/auth/2fa/status
 */
export const get2FAStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const status = await twoFactorModel.getTwoFactorStatus(userId);

    res.status(200).json({
      success: true,
      enabled: status?.two_factor_enabled || false,
      backupCodesCount: status?.backup_codes_count || 0,
    });
  } catch (error) {
    logger.error('Error in get2FAStatus controller', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch 2FA status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Regenerate backup codes
 * POST /api/auth/2fa/regenerate-codes
 */
export const regenerateBackupCodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { password }: RegenerateBackupCodesRequest = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required',
      });
      return;
    }

    // Verify password
    const [rows]: any = await require('../config/database').pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
      return;
    }

    // Check if 2FA is enabled
    const status = await twoFactorModel.getTwoFactorStatus(userId);
    if (!status?.two_factor_enabled) {
      res.status(400).json({
        success: false,
        message: '2FA is not enabled',
      });
      return;
    }

    // Generate new backup codes
    const newCodes = twoFactorService.generateBackupCodes();
    const hashedCodes = twoFactorService.hashBackupCodes(newCodes);

    // Update in database
    const success = await twoFactorModel.regenerateBackupCodes(userId, hashedCodes);

    if (!success) {
      res.status(500).json({
        success: false,
        message: 'Failed to regenerate backup codes',
      });
      return;
    }

    logger.info('Backup codes regenerated', { userId });

    res.status(200).json({
      success: true,
      backupCodes: newCodes,
    });
  } catch (error) {
    logger.error('Error in regenerateBackupCodes controller', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate backup codes',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
