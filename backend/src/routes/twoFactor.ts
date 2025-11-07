/**
 * Two-Factor Authentication Routes
 * Handles all 2FA-related endpoints
 */

import express from 'express';
import {
  setup2FA,
  enable2FA,
  verify2FA,
  disable2FA,
  get2FAStatus,
  regenerateBackupCodes,
} from '../controllers/twoFactorController.js';
import { authenticateToken } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * @route   POST /api/auth/2fa/setup
 * @desc    Initialize 2FA setup (generate QR code and backup codes)
 * @access  Private (requires authentication)
 */
router.post('/setup', authenticateToken, setup2FA);

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable 2FA after verifying TOTP token
 * @access  Private (requires authentication)
 */
router.post('/enable', authenticateToken, enable2FA);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify 2FA token (TOTP or backup code)
 * @access  Public (used during login flow)
 */
router.post('/verify', verify2FA);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA (requires password + optional token)
 * @access  Private (requires authentication)
 */
router.post('/disable', authenticateToken, disable2FA);

/**
 * @route   GET /api/auth/2fa/status
 * @desc    Get user's 2FA status
 * @access  Private (requires authentication)
 */
router.get('/status', authenticateToken, get2FAStatus);

/**
 * @route   POST /api/auth/2fa/regenerate-codes
 * @desc    Regenerate backup codes (requires password)
 * @access  Private (requires authentication)
 */
router.post('/regenerate-codes', authenticateToken, regenerateBackupCodes);

export default router;
