/**
 * Authentication Routes
 * Defines all authentication endpoints
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticate.js';
import {
  handleRegister,
  handleLogin,
  handleLoginWith2FA,
  handleRefreshToken,
  handleGetMe,
  handleLogout,
  handleGetPendingRegistrations,
  handleApproveRegistration,
  handleRejectRegistration,
} from '../controllers/authController.js';

const router = Router();

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, first_name, last_name, ... }
 * Response: 201 { success, user, registration_id }
 */
router.post('/register', handleRegister);

/**
 * POST /api/auth/login
 * Authenticate user and get tokens
 * Body: { email, password }
 * Response: 200 { success, user, tokens } or { success, requires2FA: true }
 */
router.post('/login', handleLogin);

/**
 * POST /api/auth/login/verify-2fa
 * Complete login with 2FA verification
 * Body: { email, password, token, isBackupCode? }
 * Response: 200 { success, user, tokens }
 */
router.post('/login/verify-2fa', handleLoginWith2FA);

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 * Body: { refresh_token }
 * Response: 200 { success, tokens }
 */
router.post('/refresh-token', handleRefreshToken);

/**
 * POST /api/auth/logout
 * Logout user (token blacklist in future)
 * Response: 200 { success, message }
 */
router.post('/logout', authenticateToken, handleLogout);

/**
 * GET /api/auth/me
 * Get current user info (protected)
 * Headers: Authorization: Bearer <token>
 * Response: 200 { success, user }
 */
router.get('/me', authenticateToken, handleGetMe);

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * GET /api/admin/registrations/pending
 * Get pending registrations (admin only)
 * Headers: Authorization: Bearer <token>
 * Query: ?limit=50&offset=0
 * Response: 200 { success, total, pending }
 */
router.get('/admin/registrations/pending', authenticateToken, handleGetPendingRegistrations);

/**
 * POST /api/admin/registrations/:id/approve
 * Approve a registration (admin only)
 * Headers: Authorization: Bearer <token>
 * Params: id (registration_id)
 * Body: { role_id?, notes? }
 * Response: 200 { success, message, registration_id, action }
 */
router.post('/admin/registrations/:id/approve', authenticateToken, handleApproveRegistration);

/**
 * POST /api/admin/registrations/:id/reject
 * Reject a registration (admin only)
 * Headers: Authorization: Bearer <token>
 * Params: id (registration_id)
 * Body: { reason }
 * Response: 200 { success, message, registration_id, action }
 */
router.post('/admin/registrations/:id/reject', authenticateToken, handleRejectRegistration);

export default router;
