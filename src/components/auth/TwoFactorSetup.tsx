/**
 * Two-Factor Authentication Setup Component
 * Guides users through enabling 2FA with TOTP and backup codes
 * Refactored to use useAsyncOperation and useAsyncMutation hooks
 */

import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Download, Check, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { twoFactorService, TOTPSecret } from '../../services/twoFactorService';
import { logger } from '../../utils/logger';
import { useAsyncData, useAsyncMutation } from '../../hooks/useAsyncOperation';

interface TwoFactorSetupProps {
  email: string;
  onSetupComplete: (secret: string, backupCodes: string[]) => Promise<void>;
  onCancel?: () => void;
}

type SetupStep = 'scan' | 'verify' | 'backup' | 'complete';

interface SetupState {
  currentStep: SetupStep;
  totpSecret: TOTPSecret | null;
  backupCodes: string[];
  verificationToken: string;
  showManualEntry: boolean;
  showBackupCodes: boolean;
  setupComplete: boolean;
}

/**
 * Two-Factor Authentication Setup Component
 * Step 1: Scan QR code with authenticator app
 * Step 2: Verify with TOTP token
 * Step 3: Save backup codes
 * Step 4: Completion confirmation
 */
export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ email, onSetupComplete, onCancel }) => {
  const [state, setState] = useState<SetupState>({
    currentStep: 'scan',
    totpSecret: null,
    backupCodes: [],
    verificationToken: '',
    showManualEntry: false,
    showBackupCodes: false,
    setupComplete: false,
  });

  /**
   * Initialize 2FA setup by generating TOTP secret
   * Uses useAsyncData hook for automatic initialization
   */
  const { data: setupData, loading: isInitializing, error: initError } = useAsyncData(
    async () => {
      const totpSecret = await twoFactorService.generateTOTPSecret(email);
      const backupCodes = twoFactorService.generateBackupCodes();

      setState((prev) => ({
        ...prev,
        totpSecret,
        backupCodes,
      }));

      logger.info('2FA setup initialized', { email });
      return { totpSecret, backupCodes };
    },
    [email],
    {
      showErrorToast: true,
      errorMessage: 'Failed to initialize 2FA setup. Please try again.',
      autoLog: true,
    }
  );

  /**
   * Handle TOTP token verification using useAsyncMutation
   */
  const { mutate: verifyToken, loading: isVerifying, error: verifyError } = useAsyncMutation(
    async () => {
      if (!state.totpSecret) {
        throw new Error('TOTP secret not initialized');
      }

      // Validate input format
      if (!twoFactorService.validateSetupInputs(state.totpSecret.secret, state.verificationToken)) {
        throw new Error('Invalid token format. Please enter a 6-digit code.');
      }

      // Verify TOTP token
      const isValid = twoFactorService.verifyTOTPToken(
        state.totpSecret.secret,
        state.verificationToken
      );

      if (!isValid) {
        throw new Error('Invalid verification code. Please check and try again.');
      }

      logger.info('TOTP token verified successfully', { email });
      return { valid: true };
    },
    {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: 'Verification code accepted!',
      autoLog: true,
    }
  );

  /**
   * Handle verification - move to backup codes step
   */
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await verifyToken();

      setState((prev) => ({
        ...prev,
        currentStep: 'backup',
      }));
    } catch (error) {
      logger.error('Token verification failed', error);
    }
  };

  /**
   * Handle backup codes acknowledgment and setup completion
   * Uses useAsyncMutation for standardized async handling
   */
  const { mutate: completeSetup, loading: isCompleting, error: completeError } = useAsyncMutation(
    async () => {
      if (!state.totpSecret || state.backupCodes.length === 0) {
        throw new Error('Setup data missing');
      }

      // Call parent callback to save 2FA data
      await onSetupComplete(state.totpSecret.secret, state.backupCodes);

      logger.info('2FA setup completed', { email });
      return { success: true };
    },
    {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: '2FA setup completed successfully!',
      autoLog: true,
    }
  );

  /**
   * Handle completing setup
   */
  const handleCompleteSetup = async () => {
    try {
      await completeSetup();

      setState((prev) => ({
        ...prev,
        currentStep: 'complete',
        setupComplete: true,
      }));
    } catch (error) {
      logger.error('Failed to complete 2FA setup', error);
    }
  };

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  /**
   * Download backup codes
   */
  const downloadBackupCodes = () => {
    if (!state.totpSecret) return;

    const recoveryData = twoFactorService.generateRecoveryData(
      email,
      state.totpSecret.secret,
      state.backupCodes
    );

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(recoveryData)}`);
    element.setAttribute('download', `2fa-recovery-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Recovery data downloaded');
  };

  // Determine current error state
  const currentError = initError?.userMessage || verifyError?.userMessage || completeError?.userMessage || null;

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Preparing 2FA setup...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {(['scan', 'verify', 'backup', 'complete'] as SetupStep[]).map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  state.currentStep === step
                    ? 'bg-blue-600 text-white'
                    : state.setupComplete || ['scan', 'verify', 'backup'].includes(state.currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {state.setupComplete && index < 4 ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {step === 'scan' && 'Scan'}
                {step === 'verify' && 'Verify'}
                {step === 'backup' && 'Backup'}
                {step === 'complete' && 'Done'}
              </p>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width:
                state.setupComplete
                  ? '100%'
                  : state.currentStep === 'scan'
                  ? '25%'
                  : state.currentStep === 'verify'
                  ? '50%'
                  : state.currentStep === 'backup'
                  ? '75%'
                  : '100%',
            }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {currentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{currentError}</p>
        </div>
      )}

      {/* Step 1: Scan QR Code */}
      {state.currentStep === 'scan' && state.totpSecret && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Scan QR Code</h2>
            <p className="text-gray-600">
              Use an authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.) to scan this QR code.
            </p>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
            <img
              src={state.totpSecret.qrCode}
              alt="2FA QR Code"
              className="w-64 h-64 border-2 border-gray-200 rounded-lg"
            />
          </div>

          {/* Manual Entry Option */}
          <div className="border-t pt-6">
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, showManualEntry: !prev.showManualEntry }))}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              {state.showManualEntry ? '✓' : '◆'} Can't scan? Enter manually
            </button>

            {state.showManualEntry && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Enter this key in your authenticator app:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-white border border-gray-300 rounded font-mono text-lg tracking-widest">
                    {state.totpSecret.manualEntryKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(state.totpSecret!.manualEntryKey, 'Secret key')}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setState((prev) => ({ ...prev, currentStep: 'verify' }))}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            I've Scanned the Code
          </button>
        </div>
      )}

      {/* Step 2: Verify Token */}
      {state.currentStep === 'verify' && state.totpSecret && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Verify Code</h2>
            <p className="text-gray-600">
              Enter the 6-digit code from your authenticator app to verify the setup.
            </p>
          </div>

          <form onSubmit={handleVerifyToken} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={state.verificationToken}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setState((prev) => ({ ...prev, verificationToken: value }));
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-3xl tracking-widest font-mono p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                This code changes every 30 seconds
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setState((prev) => ({ ...prev, currentStep: 'scan' }))}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifying || state.verificationToken.length !== 6}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying && <Loader className="w-5 h-5 animate-spin" />}
                Verify Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Backup Codes */}
      {state.currentStep === 'backup' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Save Backup Codes</h2>
            <p className="text-gray-600 mb-4">
              Save these backup codes in a secure location. You can use them if you lose access to your authenticator app.
              Each code can only be used once.
            </p>
          </div>

          {/* Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold">Keep these codes safe!</p>
              <p>Anyone with access to these codes can access your account.</p>
            </div>
          </div>

          {/* Backup Codes Display */}
          <div className="relative">
            <div
              className={`p-6 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm space-y-2 ${
                !state.showBackupCodes ? 'blur-sm' : ''
              }`}
            >
              {state.backupCodes.map((code, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-500">{index + 1}.</span>
                  <span className="font-semibold tracking-wider">{code}</span>
                </div>
              ))}
            </div>

            {!state.showBackupCodes && (
              <button
                type="button"
                onClick={() => setState((prev) => ({ ...prev, showBackupCodes: true }))}
                className="absolute inset-0 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Eye className="w-5 h-5" />
                Show Backup Codes
              </button>
            )}
          </div>

          {state.showBackupCodes && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(state.backupCodes.join('\n'), 'Backup codes')
                }
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
              <button
                type="button"
                onClick={downloadBackupCodes}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={state.showBackupCodes}
              onChange={(e) => setState((prev) => ({ ...prev, showBackupCodes: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I have saved my backup codes in a secure location
            </span>
          </label>

          {/* Complete Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, currentStep: 'verify' }))}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCompleteSetup}
              disabled={isCompleting || !state.showBackupCodes}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isCompleting && <Loader className="w-5 h-5 animate-spin" />}
              Complete Setup
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {state.currentStep === 'complete' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">2FA Enabled!</h2>
            <p className="text-gray-600">
              Two-factor authentication has been successfully enabled on your account.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Your authenticator app is linked</p>
                <p className="text-gray-600">You'll need to provide a code from your app when signing in</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Your backup codes are saved</p>
                <p className="text-gray-600">Use them if you lose access to your authenticator app</p>
              </div>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
