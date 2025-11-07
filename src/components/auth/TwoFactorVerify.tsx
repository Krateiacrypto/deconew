/**
 * Two-Factor Authentication Verification Component
 * Prompts user to enter TOTP code or backup code during login
 * Refactored to use useAsyncMutation hook
 */

import React, { useState } from 'react';
import { Loader, AlertCircle, HelpCircle } from 'lucide-react';
import { twoFactorService } from '../../services/twoFactorService';
import { logger } from '../../utils/logger';
import { useAsyncMutation } from '../../hooks/useAsyncOperation';

interface TwoFactorVerifyProps {
  onVerify: (token: string, isBackupCode: boolean) => Promise<void>;
  onCancel?: () => void;
  userEmail?: string;
}

type VerificationMethod = 'totp' | 'backup';

interface VerifyState {
  method: VerificationMethod;
  code: string;
  isVerifying: boolean;
  error: string | null;
  attempts: number;
  maxAttempts: number;
}

/**
 * Two-Factor Authentication Verification Component
 * Allows user to verify with TOTP or backup codes
 */
export const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({
  onVerify,
  onCancel,
  userEmail,
}) => {
  const [state, setState] = useState<VerifyState>({
    method: 'totp',
    code: '',
    isVerifying: false,
    error: null,
    attempts: 0,
    maxAttempts: 5,
  });

  /**
   * Verification mutation using useAsyncMutation hook
   * Maintains attempt tracking separately from async state
   */
  const { mutate: performVerify, loading: verifyLoading, error: verifyError } = useAsyncMutation(
    async () => {
      if (state.attempts >= state.maxAttempts) {
        throw new Error('Too many failed attempts. Please try again later.');
      }

      if (!state.code.trim()) {
        throw new Error('Please enter a verification code');
      }

      // Validate format based on method
      if (state.method === 'totp') {
        const cleanCode = state.code.replace(/\s/g, '');
        if (!/^\d{6}$/.test(cleanCode)) {
          throw new Error('TOTP code must be 6 digits');
        }
      } else if (state.method === 'backup') {
        if (!state.code.includes('-')) {
          throw new Error('Backup code format is XXXX-XXXX');
        }
      }

      // Call verification callback
      await onVerify(state.code, state.method === 'backup');

      logger.info('2FA verification successful', {
        method: state.method,
        userEmail,
      });

      return { success: true };
    },
    {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: 'Verification successful',
      autoLog: true,
      onSuccess: () => {
        setState((prev) => ({
          ...prev,
          code: '',
        }));
      },
      onError: (error) => {
        logger.warn('2FA verification failed', {
          method: state.method,
          attempt: state.attempts + 1,
          error: error.userMessage,
        });

        // Increment attempts on error
        setState((prev) => ({
          ...prev,
          error: error.userMessage,
          attempts: prev.attempts + 1,
        }));
      },
    }
  );

  /**
   * Handle verification code submission
   */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await performVerify();
  };

  const attemptsRemaining = state.maxAttempts - state.attempts;
  const isLocked = state.attempts >= state.maxAttempts;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600">
          {state.method === 'totp'
            ? 'Enter the 6-digit code from your authenticator app'
            : 'Enter one of your backup codes'}
        </p>
      </div>

      {/* Method Selector */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              method: 'totp',
              code: '',
              error: null,
            }))
          }
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            state.method === 'totp'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Authenticator App
        </button>
        <button
          type="button"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              method: 'backup',
              code: '',
              error: null,
            }))
          }
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            state.method === 'backup'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Backup Code
        </button>
      </div>

      {/* Error Alert */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">{state.error}</p>
            {attemptsRemaining <= 2 && attemptsRemaining > 0 && (
              <p className="text-red-700 text-sm mt-1">
                {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining
              </p>
            )}
          </div>
        </div>
      )}

      {/* Account Locked Alert */}
      {isLocked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold mb-2">Account Temporarily Locked</p>
          <p className="text-red-700 text-sm">
            Too many failed verification attempts. Please wait a few minutes and try again.
          </p>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="space-y-4" disabled={isLocked}>
        <div>
          <input
            type={state.method === 'totp' ? 'text' : 'text'}
            value={state.code}
            onChange={(e) => {
              const value = e.target.value;
              setState((prev) => ({
                ...prev,
                code: state.method === 'totp' ? value.replace(/\D/g, '').slice(0, 6) : value,
                error: null,
              }));
            }}
            placeholder={state.method === 'totp' ? '000000' : 'XXXX-XXXX'}
            disabled={isLocked}
            className={`w-full text-center ${
              state.method === 'totp' ? 'text-3xl' : 'text-lg'
            } tracking-widest font-mono p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400`}
            autoFocus
          />
          {state.method === 'totp' && (
            <p className="mt-2 text-center text-sm text-gray-500">
              This code changes every 30 seconds
            </p>
          )}
          {state.method === 'backup' && (
            <p className="mt-2 text-center text-sm text-gray-500">
              Format: XXXX-XXXX (one backup code)
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={verifyLoading || isLocked}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={
              verifyLoading ||
              isLocked ||
              (state.method === 'totp' ? state.code.length !== 6 : state.code.length === 0)
            }
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {verifyLoading && <Loader className="w-5 h-5 animate-spin" />}
            Verify Code
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-6 pt-6 border-t">
        <details className="cursor-pointer group">
          <summary className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            <HelpCircle className="w-4 h-4 group-open:hidden" />
            Need help?
          </summary>
          <div className="mt-3 space-y-3 text-sm text-gray-600">
            {state.method === 'totp' ? (
              <>
                <p>
                  <strong>Can't access your authenticator app?</strong>
                </p>
                <p>
                  Try using one of your backup codes instead. Switch to the "Backup Code" option
                  above.
                </p>
                <p className="text-xs text-gray-500">
                  Each backup code can only be used once. After using all codes, you'll need to
                  disable and re-enable 2FA.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Backup code format:</strong> XXXX-XXXX
                </p>
                <p>
                  These codes were provided when you enabled two-factor authentication. Each code
                  can only be used once.
                </p>
                <p className="text-xs text-gray-500">
                  If you've used all your backup codes, you'll need to disable and re-enable 2FA
                  to get new codes.
                </p>
              </>
            )}
          </div>
        </details>
      </div>

      {/* User Info */}
      {userEmail && (
        <p className="mt-6 text-xs text-center text-gray-500">
          Signing in as <strong>{userEmail}</strong>
        </p>
      )}
    </div>
  );
};

export default TwoFactorVerify;
