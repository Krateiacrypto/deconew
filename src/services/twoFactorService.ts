/**
 * Two-Factor Authentication (2FA) Service
 * Handles TOTP setup, verification, and backup codes
 */

import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { ApiError, createError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export interface TOTPSecret {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
}

export interface BackupCodes {
  codes: string[];
  generatedAt: Date;
}

export interface TwoFactorConfig {
  appName: string;
  issuer: string;
  window: number; // Time window in seconds for TOTP validation (default: 30)
}

const DEFAULT_CONFIG: TwoFactorConfig = {
  appName: 'DECARBONIZE.world',
  issuer: 'DECARBONIZE',
  window: 30,
};

/**
 * 2FA Service for TOTP-based authentication
 */
export class TwoFactorService {
  private config: TwoFactorConfig;

  constructor(config?: Partial<TwoFactorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate TOTP secret and QR code for new 2FA setup
   * @param userEmail - User's email address
   * @returns TOTP secret, QR code, and manual entry key
   */
  async generateTOTPSecret(userEmail: string): Promise<TOTPSecret> {
    try {
      if (!userEmail || typeof userEmail !== 'string') {
        throw createError.validation('Valid email address is required');
      }

      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `${this.config.appName} (${userEmail})`,
        issuer: this.config.issuer,
        length: 32, // Standard length for TOTP secrets
      });

      if (!secret.otpauth_url) {
        throw new Error('Failed to generate OTPAuth URL');
      }

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      });

      logger.info('TOTP secret generated successfully', {
        email: userEmail,
        timestamp: new Date().toISOString(),
      });

      return {
        secret: secret.base32,
        qrCode,
        manualEntryKey: secret.base32,
      };
    } catch (error) {
      logger.error('Failed to generate TOTP secret', error);
      throw createError.server('Failed to generate 2FA secret', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Verify TOTP token
   * @param secret - Base32 encoded TOTP secret
   * @param token - 6-digit TOTP token to verify
   * @returns True if token is valid
   */
  verifyTOTPToken(secret: string, token: string): boolean {
    try {
      if (!secret || !token) {
        return false;
      }

      // Remove spaces from token
      const cleanToken = token.replace(/\s/g, '');

      // Validate token format (6 digits)
      if (!/^\d{6}$/.test(cleanToken)) {
        logger.warn('Invalid TOTP token format', {
          tokenLength: cleanToken.length,
          isNumeric: /^\d+$/.test(cleanToken),
        });
        return false;
      }

      // Verify token with small time window to account for clock skew
      const isValid = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: cleanToken,
        window: 2, // Allow 1 step before and after (±30 seconds)
      });

      if (!isValid) {
        logger.warn('TOTP verification failed', {
          timestamp: new Date().toISOString(),
        });
      }

      return Boolean(isValid);
    } catch (error) {
      logger.error('Error during TOTP verification', error);
      return false;
    }
  }

  /**
   * Generate backup codes (10 codes, 8 characters each)
   * @returns Array of backup codes
   */
  generateBackupCodes(): string[] {
    try {
      const codes: string[] = [];
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      for (let i = 0; i < 10; i++) {
        let code = '';
        for (let j = 0; j < 8; j++) {
          code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Format as XXXX-XXXX
        codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
      }

      logger.info('Backup codes generated', {
        count: codes.length,
        timestamp: new Date().toISOString(),
      });

      return codes;
    } catch (error) {
      logger.error('Failed to generate backup codes', error);
      throw createError.server('Failed to generate backup codes');
    }
  }

  /**
   * Verify backup code and remove it from the list
   * @param backupCodes - Array of remaining backup codes
   * @param code - Backup code to verify
   * @returns Object with isValid flag and remaining codes
   */
  verifyBackupCode(
    backupCodes: string[],
    code: string
  ): { isValid: boolean; remainingCodes: string[] } {
    try {
      if (!Array.isArray(backupCodes) || !code) {
        return { isValid: false, remainingCodes: backupCodes };
      }

      // Clean the input code
      const cleanCode = code.toUpperCase().replace(/\s/g, '');

      // Find and remove the code
      const index = backupCodes.findIndex((c) => c === cleanCode);

      if (index === -1) {
        logger.warn('Invalid backup code attempted', {
          codeLength: cleanCode.length,
          timestamp: new Date().toISOString(),
        });
        return { isValid: false, remainingCodes: backupCodes };
      }

      const remainingCodes = backupCodes.filter((_, i) => i !== index);

      logger.info('Backup code used successfully', {
        remainingCount: remainingCodes.length,
        timestamp: new Date().toISOString(),
      });

      return { isValid: true, remainingCodes };
    } catch (error) {
      logger.error('Error verifying backup code', error);
      return { isValid: false, remainingCodes: backupCodes };
    }
  }

  /**
   * Validate 2FA setup inputs
   * @param secret - TOTP secret
   * @param token - TOTP token for verification
   * @returns True if validation passes
   */
  validateSetupInputs(secret: string, token: string): boolean {
    if (!secret || typeof secret !== 'string') {
      logger.warn('Invalid TOTP secret provided');
      return false;
    }

    if (!token || typeof token !== 'string') {
      logger.warn('Invalid TOTP token provided');
      return false;
    }

    // Verify token format
    const cleanToken = token.replace(/\s/g, '');
    if (!/^\d{6}$/.test(cleanToken)) {
      logger.warn('TOTP token format invalid', {
        providedLength: cleanToken.length,
      });
      return false;
    }

    return true;
  }

  /**
   * Get current TOTP token for testing/demonstration
   * (Should only be used in development or for testing purposes)
   * @param secret - TOTP secret
   * @returns Current 6-digit token
   */
  getCurrentToken(secret: string): string {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('getCurrentToken can only be used in development mode');
    }

    try {
      const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
      });

      return token;
    } catch (error) {
      logger.error('Failed to get current TOTP token', error);
      throw createError.server('Failed to generate TOTP token');
    }
  }

  /**
   * Format backup codes for display (with line breaks)
   * @param codes - Array of backup codes
   * @returns Formatted string for display/printing
   */
  formatBackupCodesForDisplay(codes: string[]): string {
    return codes
      .map((code, index) => `${index + 1}. ${code}`)
      .join('\n');
  }

  /**
   * Generate 2FA recovery data for export
   * @param email - User email
   * @param secret - TOTP secret
   * @param backupCodes - Backup codes
   * @returns Recovery data string
   */
  generateRecoveryData(email: string, secret: string, backupCodes: string[]): string {
    const recoveryData = `
DECARBONIZE.world - Two-Factor Authentication Recovery Data
============================================================

Generated: ${new Date().toISOString()}
Email: ${email}

IMPORTANT: Store this information in a secure location.
Your backup codes can be used if you lose access to your authenticator app.

TOTP Secret (for manual entry):
${secret}

Backup Codes (use each code only once):
${this.formatBackupCodesForDisplay(backupCodes)}

Instructions:
1. Save this file in a secure location (password manager, secure cloud storage, etc.)
2. Do NOT share this information with anyone
3. If you lose your authenticator app, you can use your backup codes to access your account
4. Keep these codes safe - once used, they cannot be reused
`;

    return recoveryData.trim();
  }
}

// Export singleton instance with default config
export const twoFactorService = new TwoFactorService();

export default TwoFactorService;
