/**
 * Authentication Service
 * Business logic for authentication operations
 */

import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  RegisterRequest,
  LoginRequest,
  UserResponse,
  AuthTokenResponse,
  JwtPayload,
  JwtRefreshPayload,
  UserRecord,
  PendingRegistrationRecord,
  UserStatus,
} from '../types/auth.js';

// ============================================
// PASSWORD HASHING
// ============================================

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// JWT TOKEN MANAGEMENT
// ============================================

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_minimum_32_characters_long_here_2024_12345';
  const expiresIn = process.env.JWT_ACCESS_EXPIRY || '3600'; // 1 hour

  return jwt.sign(payload, secret, {
    expiresIn: parseInt(expiresIn),
    algorithm: 'HS256',
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: JwtPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key_minimum_32_characters_long_here_2024';
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '604800'; // 7 days

  return jwt.sign(
    { ...payload, type: 'refresh' } as JwtRefreshPayload,
    secret,
    {
      expiresIn: parseInt(expiresIn),
      algorithm: 'HS256',
    }
  );
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_minimum_32_characters_long_here_2024_12345';

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtRefreshPayload | null {
  const secret = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key_minimum_32_characters_long_here_2024';

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return decoded as JwtRefreshPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate both tokens
 */
export function generateTokens(user: { id: number; email: string; role_id?: number }): AuthTokenResponse {
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role_id: user.role_id,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role_id: user.role_id,
  });

  const expiresIn = parseInt(process.env.JWT_ACCESS_EXPIRY || '3600');

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: 'Bearer',
  };
}

// ============================================
// USER REGISTRATION
// ============================================

/**
 * Register new user
 * Creates pending registration entry
 */
export async function registerUser(
  data: RegisterRequest
): Promise<{ registration_id: number; user_id?: number; email: string }> {
  const connection = await pool.getConnection();

  try {
    // Check if email already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [data.email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // Check if pending registration exists
    const [existingRegistration] = await connection.execute(
      'SELECT id FROM pending_registrations WHERE email = ? AND status IN ("submitted", "under_review")',
      [data.email]
    );

    if (Array.isArray(existingRegistration) && existingRegistration.length > 0) {
      throw new Error('ALREADY_REGISTERED');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Insert into pending_registrations
    const [result] = await connection.execute(
      `INSERT INTO pending_registrations
       (email, password_hash, first_name, last_name, organization_name,
        organization_type, phone, country, language, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.email,
        passwordHash,
        data.first_name,
        data.last_name,
        data.organization_name || null,
        data.organization_type || null,
        data.phone || null,
        data.country || null,
        data.language || 'tr',
        'submitted',
      ]
    );

    const registration_id = (result as any).insertId;

    connection.release();

    return {
      registration_id,
      email: data.email,
    };
  } catch (error) {
    connection.release();
    throw error;
  }
}

// ============================================
// USER LOGIN
// ============================================

/**
 * Authenticate user and return user + tokens
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: UserResponse; tokens: AuthTokenResponse }> {
  const connection = await pool.getConnection();

  try {
    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const user = users[0] as UserRecord;

    // Check password
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check user status (only active users can login)
    if (user.status !== 'active') {
      throw new Error('USER_NOT_ACTIVE');
    }

    // Update last_login
    await connection.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    // Map to response
    const userResponse = mapUserToResponse(user);

    connection.release();

    return {
      user: userResponse,
      tokens,
    };
  } catch (error) {
    connection.release();
    throw error;
  }
}

// ============================================
// TOKEN REFRESH
// ============================================

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokenResponse> {
  // Verify refresh token
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error('INVALID_TOKEN');
  }

  // Get user from database to ensure still active
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.execute(
      'SELECT id, email, role_id FROM users WHERE id = ?',
      [payload.id]
    );

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('USER_NOT_FOUND');
    }

    const user = users[0] as any;

    // Generate new tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    connection.release();

    return tokens;
  } catch (error) {
    connection.release();
    throw error;
  }
}

// ============================================
// ADMIN OPERATIONS
// ============================================

/**
 * Get pending registrations for admin approval
 */
export async function getPendingRegistrations(limit = 50, offset = 0): Promise<{
  total: number;
  registrations: PendingRegistrationRecord[];
}> {
  const connection = await pool.getConnection();

  try {
    // Get total count
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM pending_registrations WHERE status IN ("submitted", "under_review")'
    );

    const total = (countResult as any)[0]?.total || 0;

    // Get registrations
    const [registrations] = await connection.execute(
      `SELECT * FROM pending_registrations
       WHERE status IN ("submitted", "under_review")
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    connection.release();

    return {
      total,
      registrations: (registrations as any) || [],
    };
  } catch (error) {
    connection.release();
    throw error;
  }
}

/**
 * Approve registration and create user account
 */
export async function approveRegistration(
  registration_id: number,
  role_id?: number,
  reviewed_by?: number
): Promise<{ user_id: number; email: string }> {
  const connection = await pool.getConnection();

  try {
    // Get pending registration
    const [registrations] = await connection.execute(
      'SELECT * FROM pending_registrations WHERE id = ?',
      [registration_id]
    );

    if (!Array.isArray(registrations) || registrations.length === 0) {
      throw new Error('REGISTRATION_NOT_FOUND');
    }

    const registration = registrations[0] as PendingRegistrationRecord;

    // Create user account
    const [result] = await connection.execute(
      `INSERT INTO users
       (email, password_hash, first_name, last_name, organization_name,
        organization_type, phone, country, language, role_id, status,
        kyc_level, kyc_status, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        registration.email,
        registration.password_hash,
        registration.first_name,
        registration.last_name,
        registration.organization_name,
        registration.organization_type,
        registration.phone,
        registration.country,
        registration.language,
        role_id || null,
        'active',
        'level_1',
        'pending',
        true,
      ]
    );

    const user_id = (result as any).insertId;

    // Update registration status
    await connection.execute(
      `UPDATE pending_registrations
       SET status = "approved", reviewed_at = NOW(), reviewed_by = ?
       WHERE id = ?`,
      [reviewed_by || null, registration_id]
    );

    connection.release();

    return {
      user_id,
      email: registration.email,
    };
  } catch (error) {
    connection.release();
    throw error;
  }
}

/**
 * Reject registration
 */
export async function rejectRegistration(
  registration_id: number,
  reason: string,
  reviewed_by?: number
): Promise<{ registration_id: number; email: string }> {
  const connection = await pool.getConnection();

  try {
    // Get pending registration
    const [registrations] = await connection.execute(
      'SELECT * FROM pending_registrations WHERE id = ?',
      [registration_id]
    );

    if (!Array.isArray(registrations) || registrations.length === 0) {
      throw new Error('REGISTRATION_NOT_FOUND');
    }

    const registration = registrations[0] as PendingRegistrationRecord;

    // Update registration status
    await connection.execute(
      `UPDATE pending_registrations
       SET status = "rejected", rejection_reason = ?, reviewed_at = NOW(), reviewed_by = ?
       WHERE id = ?`,
      [reason, reviewed_by || null, registration_id]
    );

    connection.release();

    return {
      registration_id,
      email: registration.email,
    };
  } catch (error) {
    connection.release();
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Map user record to response (remove sensitive data)
 */
function mapUserToResponse(user: UserRecord): UserResponse {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
    role_id: user.role_id,
    kyc_level: user.kyc_level,
    kyc_status: user.kyc_status,
    organization_name: user.organization_name,
    organization_type: user.organization_type,
    country: user.country,
    language: user.language,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<UserResponse | null> {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    const user = users[0] as UserRecord;
    return mapUserToResponse(user);
  } finally {
    connection.release();
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserResponse | null> {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    const user = users[0] as UserRecord;
    return mapUserToResponse(user);
  } finally {
    connection.release();
  }
}
