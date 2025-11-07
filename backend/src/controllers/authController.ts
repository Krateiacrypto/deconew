/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 */

import { Request, Response } from 'express';
import {
  registerUser,
  authenticateUser,
  refreshAccessToken,
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  getUserById,
} from '../services/authService.js';
import {
  RegisterRequest,
  LoginRequest,
  LoginWith2FARequest,
  RefreshTokenRequest,
  ApproveRegistrationRequest,
  RejectRegistrationRequest,
  RegisterResponse,
  LoginResponse,
  RefreshTokenResponse,
  AdminRegistrationsResponse,
  ApprovalResponse,
} from '../types/auth.js';
import { twoFactorModel } from '../models/twoFactorModel.js';
import { twoFactorService } from '../services/twoFactorService.js';
import { logger } from '../utils/logger.js';

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function handleRegister(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, first_name, last_name, organization_name, organization_type, phone, country, language } =
      req.body as RegisterRequest;

    // Basic validation
    if (!email || !password || !first_name || !last_name) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required fields: email, password, first_name, last_name',
        code: 'INVALID_INPUT',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      });
      return;
    }

    // Password validation (minimum 8 characters)
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Password must be at least 8 characters',
        code: 'WEAK_PASSWORD',
      });
      return;
    }

    // Register user
    const result = await registerUser({
      email,
      password,
      first_name,
      last_name,
      organization_name,
      organization_type,
      phone,
      country,
      language,
    });

    const response: RegisterResponse = {
      success: true,
      message: 'Registration submitted successfully. Awaiting admin approval.',
      user: {
        id: 0,
        email: result.email,
        status: 'pending_approval',
      },
      registration_id: result.registration_id,
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Email already registered',
        code: 'EMAIL_ALREADY_EXISTS',
      });
    } else if (error.message === 'ALREADY_REGISTERED') {
      res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Email already has a pending registration',
        code: 'ALREADY_REGISTERED',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Registration failed',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 * If 2FA is enabled, returns requires2FA flag without tokens
 */
export async function handleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing email or password',
        code: 'INVALID_INPUT',
      });
      return;
    }

    // Authenticate
    const { user, tokens } = await authenticateUser(email, password);

    // Check if 2FA is enabled
    const is2FAEnabled = await twoFactorModel.isTwoFactorEnabledByEmail(email);

    if (is2FAEnabled) {
      // 2FA required - don't send tokens yet
      logger.info('Login requires 2FA verification', { email, userId: user.id });

      res.status(200).json({
        success: true,
        message: '2FA verification required',
        requires2FA: true,
        user: {
          ...user,
          // Don't send sensitive data before 2FA verification
        },
        tokens: {
          access_token: '',
          refresh_token: '',
          expires_in: 0,
          token_type: 'Bearer' as const,
        },
      });
      return;
    }

    // No 2FA - proceed with normal login
    const response: LoginResponse = {
      success: true,
      message: 'Login successful',
      user,
      tokens,
    };

    res.status(200).json(response);
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    } else if (error.message === 'USER_NOT_ACTIVE') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User account is not active. Please contact support.',
        code: 'USER_NOT_ACTIVE',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Login failed',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}

/**
 * POST /api/auth/login/verify-2fa
 * Complete login with 2FA verification
 */
export async function handleLoginWith2FA(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, token, isBackupCode } = req.body as LoginWith2FARequest;

    // Validation
    if (!email || !password || !token) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required fields',
        code: 'INVALID_INPUT',
      });
      return;
    }

    // First, authenticate with email/password
    const { user, tokens } = await authenticateUser(email, password);

    // Verify 2FA is enabled
    const is2FAEnabled = await twoFactorModel.isTwoFactorEnabledByEmail(email);
    if (!is2FAEnabled) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: '2FA is not enabled for this account',
        code: 'TWO_FACTOR_NOT_ENABLED',
      });
      return;
    }

    // Verify 2FA token
    let isValid = false;
    if (isBackupCode) {
      // Verify backup code
      const hashedCodes = await twoFactorModel.getBackupCodesByEmail(email);
      const result = twoFactorService.verifyBackupCode(token, hashedCodes);
      isValid = result.isValid;

      if (isValid) {
        // Remove used backup code
        const userId = await twoFactorModel.getUserIdByEmail(email);
        if (userId) {
          await twoFactorModel.updateBackupCodes(userId, result.remainingCodes);
        }
        logger.info('Backup code used for login', { email, userId });
      }
    } else {
      // Verify TOTP token
      const secret = await twoFactorModel.getTOTPSecretByEmail(email);
      if (secret) {
        isValid = twoFactorService.verifyTOTPToken(secret, token);
      }
    }

    if (!isValid) {
      logger.warn('2FA verification failed during login', { email });
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid 2FA code',
        code: 'INVALID_TWO_FACTOR_CODE',
      });
      return;
    }

    // 2FA verification successful - return tokens
    logger.info('Login successful with 2FA', { email, userId: user.id });

    const response: LoginResponse = {
      success: true,
      message: 'Login successful',
      user,
      tokens,
    };

    res.status(200).json(response);
  } catch (error: any) {
    logger.error('Error in handleLoginWith2FA', { error: error.message });

    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Login failed',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
export async function handleRefreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refresh_token } = req.body as RefreshTokenRequest;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing refresh_token',
        code: 'INVALID_INPUT',
      });
      return;
    }

    const tokens = await refreshAccessToken(refresh_token);

    const response: RefreshTokenResponse = {
      success: true,
      tokens,
    };

    res.status(200).json(response);
  } catch (error: any) {
    if (error.message === 'INVALID_TOKEN' || error.message === 'USER_NOT_FOUND') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token',
        code: 'INVALID_TOKEN',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Token refresh failed',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}

/**
 * GET /api/auth/me
 * Get current user info (protected)
 */
export async function handleGetMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const user = await getUserById(req.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'Failed to retrieve user',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
export async function handleLogout(req: Request, res: Response): Promise<void> {
  // JWT is stateless, so logout is just a client-side operation
  // In the future, we could maintain a token blacklist or expiry tracking
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
}

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * GET /api/admin/registrations/pending
 * Get pending registrations (admin only)
 */
export async function handleGetPendingRegistrations(req: Request, res: Response): Promise<void> {
  try {
    // Check admin (protected)
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const { total, registrations } = await getPendingRegistrations(limit, offset);

    const response: AdminRegistrationsResponse = {
      success: true,
      total,
      pending: registrations.map((reg) => ({
        id: reg.id,
        email: reg.email,
        first_name: reg.first_name,
        last_name: reg.last_name,
        organization_name: reg.organization_name,
        organization_type: reg.organization_type,
        phone: reg.phone,
        country: reg.country,
        status: reg.status,
        created_at: reg.created_at.toISOString(),
        submitted_at: reg.submitted_at.toISOString(),
      })),
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'Failed to retrieve registrations',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

/**
 * POST /api/admin/registrations/:id/approve
 * Approve a registration (admin only)
 */
export async function handleApproveRegistration(req: Request, res: Response): Promise<void> {
  try {
    // Check admin (protected)
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const registration_id = parseInt(req.params.id);
    const { role_id } = req.body as ApproveRegistrationRequest;

    if (!registration_id) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid registration ID',
        code: 'INVALID_INPUT',
      });
      return;
    }

    const result = await approveRegistration(registration_id, role_id, req.userId);

    const response: ApprovalResponse = {
      success: true,
      message: 'Registration approved successfully',
      registration_id,
      action: 'approved',
    };

    res.status(200).json(response);
  } catch (error: any) {
    if (error.message === 'REGISTRATION_NOT_FOUND') {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Registration not found',
        code: 'REGISTRATION_NOT_FOUND',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Failed to approve registration',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}

/**
 * POST /api/admin/registrations/:id/reject
 * Reject a registration (admin only)
 */
export async function handleRejectRegistration(req: Request, res: Response): Promise<void> {
  try {
    // Check admin (protected)
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const registration_id = parseInt(req.params.id);
    const { reason } = req.body as RejectRegistrationRequest;

    if (!registration_id || !reason) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing registration ID or reason',
        code: 'INVALID_INPUT',
      });
      return;
    }

    await rejectRegistration(registration_id, reason, req.userId);

    const response: ApprovalResponse = {
      success: true,
      message: 'Registration rejected successfully',
      registration_id,
      action: 'rejected',
    };

    res.status(200).json(response);
  } catch (error: any) {
    if (error.message === 'REGISTRATION_NOT_FOUND') {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Registration not found',
        code: 'REGISTRATION_NOT_FOUND',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Failed to reject registration',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
