/**
 * Two-Factor Authentication Service (Backend)
 * Handles TOTP generation, verification, and backup codes management
 */

import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { logger } from '../utils/logger.js';
import {
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
  TwoFactorEnableResponse,
  TwoFactorDisableResponse,
  TwoFactorStatusResponse,
  RegenerateBackupCodesResponse,
} from '../types/auth.js';

export interface TOTPConfig {
  appName: string;
  issuer: string;
  window: number;
  secretLength: number;
}

const DEFAULT_CONFIG: TOTPConfig = {
  appName: 'DECARBONIZE.world',
  issuer: 'DECARBONIZE',
  window: 2, // Allow ±60 seconds for time drift
  secretLength: 32,
};

/**
 * Two-Factor Authentication Service
 * Provides TOTP-based 2FA functionality for backend
 */
export class TwoFactorService {
  private config: TOTPConfig;

  constructor(config?: Partial<TOTPConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate TOTP secret and QR code for 2FA setup
   */
  async generateTOTPSecret(email: string): Promise<TwoFactorSetupResponse> {
    try {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error('Valid email address is required');
      }

      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `${this.config.appName} (${email})`,
        issuer: this.config.issuer,
        length: this.config.secretLength,
      });

      if (!secret.otpauth_url || !secret.base32) {
        throw new Error('Failed to generate TOTP secret');
      }

      // Generate QR code as data URL
      const qrCode = await QRCode.toDataURL(secret.otpauth_url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        width: 300,
      });

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      logger.info('2FA setup initiated', { email });

      return {
        success: true,
        secret: secret.base32,
        qrCode,
        manualEntryKey: secret.base32,
        backupCodes,
      };
    } catch (error) {
      logger.error('Failed to generate TOTP secret', { email, error });
      throw new Error('Failed to generate 2FA setup data');
    }
  }

  /**
   * Verify TOTP token
   */
  verifyTOTPToken(secret: string, token: string): boolean {
    try {
      if (!secret || !token) {
        logger.warn('Missing secret or token for TOTP verification');
        return false;
      }

      // Clean token (remove spaces)
      const cleanToken = token.replace(/\s/g, '');

      // Validate format (6 digits)
      if (!/^\d{6}$/.test(cleanToken)) {
        logger.warn('Invalid TOTP token format', { tokenLength: cleanToken.length });
        return false;
      }

      // Verify with time window
      const isValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: cleanToken,
        window: this.config.window,
      });

      if (!isValid) {
        logger.warn('TOTP verification failed');
      } else {
        logger.info('TOTP verification successful');
      }

      return Boolean(isValid);
    } catch (error) {
      logger.error('Error during TOTP verification', error);
      return false;
    }
  }

  /**
   * Generate 10 backup codes (format: XXXX-XXXX)
   */
  generateBackupCodes(): string[] {
    try {
      const codes: string[] = [];
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      for (let i = 0; i < 10; i++) {
        let code = '';
        for (let j = 0; j < 8; j++) {
          // Use crypto for better randomness
          const randomIndex = crypto.randomInt(0, characters.length);
          code += characters[randomIndex];
        }

        // Format as XXXX-XXXX
        codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
      }

      logger.info('Backup codes generated', { count: codes.length });
      return codes;
    } catch (error) {
      logger.error('Failed to generate backup codes', error);
      throw new Error('Failed to generate backup codes');
    }
  }

  /**
   * Hash backup codes for secure storage
   * @param codes - Plain text backup codes
   * @returns Hashed backup codes
   */
  hashBackupCodes(codes: string[]): string[] {
    return codes.map((code) => {
      const hash = crypto.createHash('sha256').update(code).digest('hex');
      return hash;
    });
  }

  /**
   * Verify backup code against hashed list
   * @param code - Plain text backup code to verify
   * @param hashedCodes - Array of hashed backup codes
   * @returns Object with validation result and remaining codes
   */
  verifyBackupCode(
    code: string,
    hashedCodes: string[]
  ): { isValid: boolean; remainingCodes: string[]; usedCodeHash?: string } {
    try {
      if (!Array.isArray(hashedCodes) || !code) {
        return { isValid: false, remainingCodes: hashedCodes };
      }

      // Clean and normalize code
      const cleanCode = code.toUpperCase().replace(/\s/g, '');

      // Hash the provided code
      const codeHash = crypto.createHash('sha256').update(cleanCode).digest('hex');

      // Find matching hash
      const index = hashedCodes.findIndex((hash) => hash === codeHash);

      if (index === -1) {
        logger.warn('Invalid backup code attempted');
        return { isValid: false, remainingCodes: hashedCodes };
      }

      // Remove used code
      const remainingCodes = hashedCodes.filter((_, i) => i !== index);

      logger.info('Backup code verified successfully', {
        remainingCount: remainingCodes.length,
      });

      return {
        isValid: true,
        remainingCodes,
        usedCodeHash: codeHash,
      };
    } catch (error) {
      logger.error('Error verifying backup code', error);
      return { isValid: false, remainingCodes: hashedCodes };
    }
  }

  /**
   * Validate 2FA token format
   */
  validateTokenFormat(token: string, isBackupCode: boolean = false): boolean {
    const cleanToken = token.replace(/\s/g, '');

    if (isBackupCode) {
      // Backup code: XXXX-XXXX (8 chars + hyphen)
      return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleanToken.toUpperCase());
    } else {
      // TOTP: 6 digits
      return /^\d{6}$/.test(cleanToken);
    }
  }

  /**
   * Generate recovery data file content
   */
  generateRecoveryData(email: string, secret: string, backupCodes: string[]): string {
    const timestamp = new Date().toISOString();

    return `
DECARBONIZE.world - Two-Factor Authentication Recovery Data
============================================================

Generated: ${timestamp}
Email: ${email}

IMPORTANT: Store this information in a secure location.
Do NOT share with anyone. Keep offline in a safe place.

TOTP Secret (Manual Entry Key):
${secret}

Backup Codes (use each code only once):
${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

Instructions:
1. Save this file in a secure, encrypted location
2. Use backup codes if you lose access to your authenticator app
3. Each backup code can only be used once
4. If you use all codes, you'll need to reset 2FA with account recovery

Security Notice:
- Anyone with these codes can access your account
- Never send these codes via email or messaging
- Consider printing and storing in a physical safe
    `.trim();
  }

  /**
   * Get current TOTP token (for development/testing only)
   */
  getCurrentToken(secret: string): string {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('getCurrentToken is not available in production');
    }

    try {
      const token = speakeasy.totp({
        secret,
        encoding: 'base32',
      });

      return token;
    } catch (error) {
      logger.error('Failed to generate current TOTP token', error);
      throw new Error('Failed to generate TOTP token');
    }
  }
}

// Export singleton instance
export const twoFactorService = new TwoFactorService();

export default TwoFactorService;
