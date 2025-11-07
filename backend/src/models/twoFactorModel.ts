/**
 * Two-Factor Authentication Database Model
 * Handles database operations for 2FA setup, verification, and backup codes
 */

import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export interface TwoFactorRecord extends RowDataPacket {
  user_id: number;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  backup_codes: string | null; // JSON stringified array of hashed codes
  backup_codes_count: number;
  two_factor_enabled_at: Date | null;
}

/**
 * Two-Factor Authentication Model
 */
export class TwoFactorModel {
  /**
   * Get user's 2FA status and settings
   */
  async getTwoFactorStatus(userId: number): Promise<TwoFactorRecord | null> {
    try {
      const [rows] = await pool.execute<TwoFactorRecord[]>(
        `SELECT
          id as user_id,
          two_factor_enabled,
          two_factor_secret,
          backup_codes,
          CASE
            WHEN backup_codes IS NOT NULL THEN JSON_LENGTH(backup_codes)
            ELSE 0
          END as backup_codes_count
        FROM users
        WHERE id = ? AND is_active = 1`,
        [userId]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      logger.error('Error fetching 2FA status', { userId, error });
      throw new Error('Failed to fetch 2FA status');
    }
  }

  /**
   * Enable 2FA for user
   * Saves TOTP secret and hashed backup codes
   */
  async enableTwoFactor(
    userId: number,
    secret: string,
    hashedBackupCodes: string[]
  ): Promise<boolean> {
    try {
      const backupCodesJson = JSON.stringify(hashedBackupCodes);

      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE users
        SET
          two_factor_enabled = 1,
          two_factor_secret = ?,
          backup_codes = ?,
          updated_at = NOW()
        WHERE id = ? AND is_active = 1`,
        [secret, backupCodesJson, userId]
      );

      const success = result.affectedRows > 0;

      if (success) {
        logger.info('2FA enabled for user', { userId });
      } else {
        logger.warn('Failed to enable 2FA - user not found or inactive', { userId });
      }

      return success;
    } catch (error) {
      logger.error('Error enabling 2FA', { userId, error });
      throw new Error('Failed to enable 2FA');
    }
  }

  /**
   * Disable 2FA for user
   * Removes TOTP secret and backup codes
   */
  async disableTwoFactor(userId: number): Promise<boolean> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE users
        SET
          two_factor_enabled = 0,
          two_factor_secret = NULL,
          backup_codes = NULL,
          updated_at = NOW()
        WHERE id = ? AND is_active = 1`,
        [userId]
      );

      const success = result.affectedRows > 0;

      if (success) {
        logger.info('2FA disabled for user', { userId });
      } else {
        logger.warn('Failed to disable 2FA - user not found or inactive', { userId });
      }

      return success;
    } catch (error) {
      logger.error('Error disabling 2FA', { userId, error });
      throw new Error('Failed to disable 2FA');
    }
  }

  /**
   * Get user's TOTP secret (for verification)
   */
  async getTOTPSecret(userId: number): Promise<string | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT two_factor_secret
        FROM users
        WHERE id = ? AND two_factor_enabled = 1 AND is_active = 1`,
        [userId]
      );

      if (rows.length === 0 || !rows[0].two_factor_secret) {
        return null;
      }

      return rows[0].two_factor_secret;
    } catch (error) {
      logger.error('Error fetching TOTP secret', { userId, error });
      throw new Error('Failed to fetch TOTP secret');
    }
  }

  /**
   * Get user's hashed backup codes
   */
  async getBackupCodes(userId: number): Promise<string[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT backup_codes
        FROM users
        WHERE id = ? AND two_factor_enabled = 1 AND is_active = 1`,
        [userId]
      );

      if (rows.length === 0 || !rows[0].backup_codes) {
        return [];
      }

      // Parse JSON array
      const codes = JSON.parse(rows[0].backup_codes);
      return Array.isArray(codes) ? codes : [];
    } catch (error) {
      logger.error('Error fetching backup codes', { userId, error });
      throw new Error('Failed to fetch backup codes');
    }
  }

  /**
   * Update backup codes after one is used
   * Removes used backup code from database
   */
  async updateBackupCodes(userId: number, remainingCodes: string[]): Promise<boolean> {
    try {
      const backupCodesJson = JSON.stringify(remainingCodes);

      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE users
        SET
          backup_codes = ?,
          updated_at = NOW()
        WHERE id = ? AND two_factor_enabled = 1 AND is_active = 1`,
        [backupCodesJson, userId]
      );

      const success = result.affectedRows > 0;

      if (success) {
        logger.info('Backup codes updated', {
          userId,
          remainingCount: remainingCodes.length,
        });
      }

      return success;
    } catch (error) {
      logger.error('Error updating backup codes', { userId, error });
      throw new Error('Failed to update backup codes');
    }
  }

  /**
   * Regenerate backup codes for user
   */
  async regenerateBackupCodes(userId: number, newHashedCodes: string[]): Promise<boolean> {
    try {
      const backupCodesJson = JSON.stringify(newHashedCodes);

      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE users
        SET
          backup_codes = ?,
          updated_at = NOW()
        WHERE id = ? AND two_factor_enabled = 1 AND is_active = 1`,
        [backupCodesJson, userId]
      );

      const success = result.affectedRows > 0;

      if (success) {
        logger.info('Backup codes regenerated', {
          userId,
          newCount: newHashedCodes.length,
        });
      }

      return success;
    } catch (error) {
      logger.error('Error regenerating backup codes', { userId, error });
      throw new Error('Failed to regenerate backup codes');
    }
  }

  /**
   * Check if user has 2FA enabled by email
   */
  async isTwoFactorEnabledByEmail(email: string): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT two_factor_enabled
        FROM users
        WHERE email = ? AND is_active = 1`,
        [email]
      );

      if (rows.length === 0) {
        return false;
      }

      return Boolean(rows[0].two_factor_enabled);
    } catch (error) {
      logger.error('Error checking 2FA status by email', { email, error });
      throw new Error('Failed to check 2FA status');
    }
  }

  /**
   * Get TOTP secret by email (for login verification)
   */
  async getTOTPSecretByEmail(email: string): Promise<string | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT two_factor_secret
        FROM users
        WHERE email = ? AND two_factor_enabled = 1 AND is_active = 1`,
        [email]
      );

      if (rows.length === 0 || !rows[0].two_factor_secret) {
        return null;
      }

      return rows[0].two_factor_secret;
    } catch (error) {
      logger.error('Error fetching TOTP secret by email', { email, error });
      throw new Error('Failed to fetch TOTP secret');
    }
  }

  /**
   * Get backup codes by email (for login verification)
   */
  async getBackupCodesByEmail(email: string): Promise<string[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT backup_codes
        FROM users
        WHERE email = ? AND two_factor_enabled = 1 AND is_active = 1`,
        [email]
      );

      if (rows.length === 0 || !rows[0].backup_codes) {
        return [];
      }

      const codes = JSON.parse(rows[0].backup_codes);
      return Array.isArray(codes) ? codes : [];
    } catch (error) {
      logger.error('Error fetching backup codes by email', { email, error });
      throw new Error('Failed to fetch backup codes');
    }
  }

  /**
   * Get user ID by email
   */
  async getUserIdByEmail(email: string): Promise<number | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id FROM users WHERE email = ? AND is_active = 1`,
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0].id;
    } catch (error) {
      logger.error('Error fetching user ID by email', { email, error });
      throw new Error('Failed to fetch user ID');
    }
  }
}

// Export singleton instance
export const twoFactorModel = new TwoFactorModel();

export default TwoFactorModel;
