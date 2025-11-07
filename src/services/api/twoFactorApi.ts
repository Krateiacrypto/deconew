/**
 * Two-Factor Authentication API Client
 * Handles all 2FA-related backend API calls
 */

import { apiClient } from '../apiClient';
import { logger } from '../../utils/logger';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface TwoFactorSetupResponse {
  success: boolean;
  secret: string;
  qrCode: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export interface TwoFactorEnableRequest {
  secret: string;
  token: string;
  backupCodes: string[];
}

export interface TwoFactorEnableResponse {
  success: boolean;
  message: string;
  twoFactorEnabled: boolean;
}

export interface TwoFactorVerifyRequest {
  email: string;
  token: string;
  isBackupCode?: boolean;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  message: string;
  valid: boolean;
  remainingBackupCodes?: number;
}

export interface TwoFactorDisableRequest {
  password: string;
  token?: string;
}

export interface TwoFactorDisableResponse {
  success: boolean;
  message: string;
  twoFactorEnabled: boolean;
}

export interface TwoFactorStatusResponse {
  success: boolean;
  enabled: boolean;
  backupCodesCount?: number;
}

export interface RegenerateBackupCodesRequest {
  password: string;
}

export interface RegenerateBackupCodesResponse {
  success: boolean;
  backupCodes: string[];
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Two-Factor Authentication API Service
 */
export const twoFactorApi = {
  /**
   * Initialize 2FA setup (generate QR code and backup codes)
   * Requires authentication
   */
  async setup(): Promise<TwoFactorSetupResponse> {
    try {
      logger.info('Requesting 2FA setup');
      const response = await apiClient.post<TwoFactorSetupResponse>(
        '/auth/2fa/setup',
        undefined,
        true // requires auth
      );
      logger.info('2FA setup successful');
      return response;
    } catch (error) {
      logger.error('2FA setup failed', error);
      throw error;
    }
  },

  /**
   * Enable 2FA after verifying TOTP token
   * Requires authentication
   */
  async enable(data: TwoFactorEnableRequest): Promise<TwoFactorEnableResponse> {
    try {
      logger.info('Enabling 2FA');
      const response = await apiClient.post<TwoFactorEnableResponse>(
        '/auth/2fa/enable',
        data,
        true // requires auth
      );
      logger.info('2FA enabled successfully');
      return response;
    } catch (error) {
      logger.error('Failed to enable 2FA', error);
      throw error;
    }
  },

  /**
   * Verify 2FA token (TOTP or backup code)
   * Public endpoint - used during login
   */
  async verify(data: TwoFactorVerifyRequest): Promise<TwoFactorVerifyResponse> {
    try {
      logger.info('Verifying 2FA token', { email: data.email });
      const response = await apiClient.post<TwoFactorVerifyResponse>(
        '/auth/2fa/verify',
        data,
        false // public endpoint
      );
      logger.info('2FA verification result', { valid: response.valid });
      return response;
    } catch (error) {
      logger.error('2FA verification failed', error);
      throw error;
    }
  },

  /**
   * Disable 2FA (requires password and optional TOTP token)
   * Requires authentication
   */
  async disable(data: TwoFactorDisableRequest): Promise<TwoFactorDisableResponse> {
    try {
      logger.info('Disabling 2FA');
      const response = await apiClient.post<TwoFactorDisableResponse>(
        '/auth/2fa/disable',
        data,
        true // requires auth
      );
      logger.info('2FA disabled successfully');
      return response;
    } catch (error) {
      logger.error('Failed to disable 2FA', error);
      throw error;
    }
  },

  /**
   * Get current 2FA status
   * Requires authentication
   */
  async getStatus(): Promise<TwoFactorStatusResponse> {
    try {
      logger.info('Fetching 2FA status');
      const response = await apiClient.get<TwoFactorStatusResponse>(
        '/auth/2fa/status',
        true // requires auth
      );
      logger.info('2FA status retrieved', { enabled: response.enabled });
      return response;
    } catch (error) {
      logger.error('Failed to fetch 2FA status', error);
      throw error;
    }
  },

  /**
   * Regenerate backup codes (requires password)
   * Requires authentication
   */
  async regenerateCodes(
    data: RegenerateBackupCodesRequest
  ): Promise<RegenerateBackupCodesResponse> {
    try {
      logger.info('Regenerating backup codes');
      const response = await apiClient.post<RegenerateBackupCodesResponse>(
        '/auth/2fa/regenerate-codes',
        data,
        true // requires auth
      );
      logger.info('Backup codes regenerated', {
        count: response.backupCodes.length,
      });
      return response;
    } catch (error) {
      logger.error('Failed to regenerate backup codes', error);
      throw error;
    }
  },
};

export default twoFactorApi;
