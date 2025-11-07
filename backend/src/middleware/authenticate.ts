/**
 * Authentication Middleware
 * JWT verification and user context attachment
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/authService.js';
import { JwtPayload } from '../types/auth.js';

// ============================================
// MIDDLEWARE FUNCTIONS
// ============================================

/**
 * Verify JWT token and attach user to request
 * Usage: app.use(authenticateToken)
 * Usage: app.get('/protected', authenticateToken, handler)
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'No token provided',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  // Verify token
  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid or expired token',
      code: 'TOKEN_EXPIRED',
    });
    return;
  }

  // Attach user to request
  req.user = payload;
  req.userId = payload.id;
  req.userEmail = payload.email;

  next();
}

/**
 * Optional authentication middleware
 * Doesn't fail if no token, just sets user if present
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
      req.userId = payload.id;
      req.userEmail = payload.email;
    }
  }

  next();
}

/**
 * Require admin role
 * Must be used after authenticateToken
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  // TODO: Check role_id is admin in database
  // For now, just verify user exists
  next();
}

/**
 * Require specific role
 * Usage: app.get('/route', authenticateToken, requireRole('admin'), handler)
 */
export function requireRole(roleId: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    // TODO: Verify user has required role
    if (req.user.role_id !== roleId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions',
        code: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
}

/**
 * Require active user status
 */
export function requireActiveUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  // TODO: Check user.status === 'active' in database
  next();
}

// ============================================
// ERROR HANDLERS FOR AUTH
// ============================================

/**
 * Handle missing authorization header
 */
export const missingAuthHeader = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing Authorization header',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  next();
};

/**
 * Handle invalid token format
 */
export const validateTokenFormat = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid Authorization header format. Expected: Bearer <token>',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  next();
};
