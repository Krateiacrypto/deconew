/**
 * Two-Factor Authentication State Store
 * Manages 2FA settings and verification state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '../utils/logger';

export interface TwoFactorState {
  // Settings
  isEnabled: boolean;
  isSetupInProgress: boolean;
  lastVerificationTime: number | null;

  // User data (only stored after setup)
  totpSecret: string | null;
  backupCodes: string[];
  backupCodesUsed: number;

  // Recovery
  recoveryEmail: string | null;
  recoveryPhoneNumber: string | null;

  // Session state
  verificationRequired: boolean;
  sessionVerified: boolean;

  // Actions
  startSetup: () => void;
  completeSetup: (secret: string, backupCodes: string[]) => void;
  cancelSetup: () => void;
  verifyToken: (isValid: boolean) => void;
  verifyBackupCode: (code: string) => void;
  disable2FA: () => void;
  reset: () => void;

  // Getters
  getRemainingBackupCodes: () => number;
  getBackupCodesUsagePercentage: () => number;
  isSessionVerified: () => boolean;
}

const INITIAL_STATE = {
  isEnabled: false,
  isSetupInProgress: false,
  lastVerificationTime: null,
  totpSecret: null,
  backupCodes: [],
  backupCodesUsed: 0,
  recoveryEmail: null,
  recoveryPhoneNumber: null,
  verificationRequired: false,
  sessionVerified: false,
};

const VERIFICATION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * 2FA State Store
 * Persists 2FA settings to localStorage
 */
export const useTwoFactorStore = create<TwoFactorState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      /**
       * Start 2FA setup process
       */
      startSetup: () => {
        set({
          isSetupInProgress: true,
          verificationRequired: true,
        });

        logger.info('2FA setup started');
      },

      /**
       * Complete 2FA setup with secret and backup codes
       */
      completeSetup: (secret: string, backupCodes: string[]) => {
        if (!secret || backupCodes.length === 0) {
          logger.warn('Invalid 2FA setup data');
          return;
        }

        set({
          isEnabled: true,
          isSetupInProgress: false,
          totpSecret: secret,
          backupCodes: [...backupCodes],
          backupCodesUsed: 0,
          verificationRequired: false,
          sessionVerified: true,
          lastVerificationTime: Date.now(),
        });

        logger.info('2FA setup completed successfully');
      },

      /**
       * Cancel 2FA setup
       */
      cancelSetup: () => {
        set({
          isSetupInProgress: false,
          verificationRequired: false,
        });

        logger.info('2FA setup cancelled');
      },

      /**
       * Verify TOTP token and update session
       */
      verifyToken: (isValid: boolean) => {
        if (!isValid) {
          logger.warn('TOTP token verification failed');
          set({ sessionVerified: false });
          return;
        }

        set({
          sessionVerified: true,
          verificationRequired: false,
          lastVerificationTime: Date.now(),
        });

        logger.info('TOTP token verified');
      },

      /**
       * Use a backup code and update remaining codes
       */
      verifyBackupCode: (code: string) => {
        const state = get();

        if (!state.isEnabled || state.backupCodes.length === 0) {
          logger.warn('Backup code verification attempted without 2FA enabled');
          return;
        }

        const codeIndex = state.backupCodes.findIndex(
          (c) => c.toUpperCase() === code.toUpperCase()
        );

        if (codeIndex === -1) {
          logger.warn('Invalid backup code provided');
          return;
        }

        const updatedCodes = state.backupCodes.filter((_, i) => i !== codeIndex);

        set({
          backupCodes: updatedCodes,
          backupCodesUsed: state.backupCodesUsed + 1,
          sessionVerified: true,
          verificationRequired: false,
          lastVerificationTime: Date.now(),
        });

        logger.info('Backup code used successfully', {
          remainingCodes: updatedCodes.length,
        });
      },

      /**
       * Disable 2FA (requires strong verification)
       */
      disable2FA: () => {
        set({
          isEnabled: false,
          totpSecret: null,
          backupCodes: [],
          backupCodesUsed: 0,
          sessionVerified: false,
          verificationRequired: false,
        });

        logger.warn('2FA disabled');
      },

      /**
       * Reset 2FA state
       */
      reset: () => {
        set(INITIAL_STATE);
        logger.info('2FA state reset');
      },

      /**
       * Get remaining backup codes count
       */
      getRemainingBackupCodes: () => {
        const state = get();
        return state.backupCodes.length;
      },

      /**
       * Get backup codes usage percentage
       */
      getBackupCodesUsagePercentage: () => {
        const state = get();
        const total = state.backupCodesUsed + state.backupCodes.length;
        if (total === 0) return 0;
        return Math.round((state.backupCodesUsed / total) * 100);
      },

      /**
       * Check if current session is verified for 2FA
       */
      isSessionVerified: () => {
        const state = get();

        // If 2FA not enabled, session is always verified
        if (!state.isEnabled) {
          return true;
        }

        // If not verified, return false
        if (!state.sessionVerified) {
          return false;
        }

        // Check verification timeout
        if (state.lastVerificationTime === null) {
          return false;
        }

        const timeSinceVerification = Date.now() - state.lastVerificationTime;
        if (timeSinceVerification > VERIFICATION_TIMEOUT) {
          set({ sessionVerified: false, verificationRequired: true });
          return false;
        }

        return true;
      },
    }),
    {
      name: 'two-factor-store',
      // Avoid persisting sensitive data
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        backupCodesUsed: state.backupCodesUsed,
        recoveryEmail: state.recoveryEmail,
        recoveryPhoneNumber: state.recoveryPhoneNumber,
        // Don't persist: totpSecret, backupCodes (too sensitive)
        // These should come from server session only
      }),
    }
  )
);

/**
 * Hook to check if 2FA is required for current operation
 */
export const use2FARequired = () => {
  const { isEnabled, verificationRequired } = useTwoFactorStore();
  return isEnabled && verificationRequired;
};

/**
 * Hook to get 2FA status
 */
export const use2FAStatus = () => {
  const state = useTwoFactorStore();
  return {
    isEnabled: state.isEnabled,
    isSessionVerified: state.isSessionVerified(),
    isSetupInProgress: state.isSetupInProgress,
    remainingBackupCodes: state.getRemainingBackupCodes(),
    usagePercentage: state.getBackupCodesUsagePercentage(),
  };
};

export default useTwoFactorStore;
