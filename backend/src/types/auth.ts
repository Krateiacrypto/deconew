/**
 * Authentication Types & Interfaces
 */

// ============================================
// REQUEST PAYLOADS
// ============================================

/**
 * Register Request Payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_name?: string;
  organization_type?: 'individual' | 'company' | 'ngo' | 'financial_institution';
  phone?: string;
  country?: string;
  language?: 'tr' | 'en' | 'de' | 'fr';
}

/**
 * Login Request Payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login with 2FA Request
 */
export interface LoginWith2FARequest {
  email: string;
  password: string;
  token: string;
  isBackupCode?: boolean;
}

/**
 * Refresh Token Request Payload
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * Verify Email Request Payload
 */
export interface VerifyEmailRequest {
  email: string;
  token: string;
}

/**
 * Admin Approve Registration Request
 */
export interface ApproveRegistrationRequest {
  registration_id: number;
  role_id?: number;
  notes?: string;
}

/**
 * Admin Reject Registration Request
 */
export interface RejectRegistrationRequest {
  registration_id: number;
  reason: string;
}

// ============================================
// RESPONSE PAYLOADS
// ============================================

/**
 * User Response (without password)
 */
export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  role_id?: number;
  kyc_level: KycLevel;
  kyc_status: KycStatus;
  organization_name?: string;
  organization_type?: string;
  country?: string;
  language: string;
  created_at: string;
  updated_at: string;
}

/**
 * Auth Token Response
 */
export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

/**
 * Register Response
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    status: UserStatus;
  };
  registration_id: number;
}

/**
 * Login Response
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserResponse;
  tokens: AuthTokenResponse;
  requires2FA?: boolean; // If true, client must call verify-2fa endpoint
}

/**
 * Refresh Token Response
 */
export interface RefreshTokenResponse {
  success: boolean;
  tokens: AuthTokenResponse;
}

/**
 * Pending Registration Response
 */
export interface PendingRegistrationResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  organization_name?: string;
  organization_type?: string;
  phone?: string;
  country?: string;
  status: RegistrationStatus;
  created_at: string;
  submitted_at: string;
}

/**
 * Admin Registrations List Response
 */
export interface AdminRegistrationsResponse {
  success: boolean;
  total: number;
  pending: PendingRegistrationResponse[];
}

/**
 * Approve/Reject Response
 */
export interface ApprovalResponse {
  success: boolean;
  message: string;
  registration_id: number;
  action: 'approved' | 'rejected';
}

// ============================================
// JWT PAYLOAD
// ============================================

/**
 * JWT Token Payload
 */
export interface JwtPayload {
  id: number;
  email: string;
  role_id?: number;
  iat?: number;
  exp?: number;
}

/**
 * JWT Refresh Token Payload
 */
export interface JwtRefreshPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
  type: 'refresh';
}

// ============================================
// ENUMS
// ============================================

/**
 * User Status Workflow
 */
export type UserStatus =
  | 'pending_approval'
  | 'email_verified'
  | 'under_review'
  | 'active'
  | 'suspended'
  | 'rejected'
  | 'archived';

/**
 * KYC Levels
 */
export type KycLevel = 'level_1' | 'level_2' | 'level_3';

/**
 * KYC Status
 */
export type KycStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'under_review';

/**
 * Registration Status
 */
export type RegistrationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'expired';

// ============================================
// ERROR RESPONSES
// ============================================

/**
 * Auth Error Response
 */
export interface AuthErrorResponse {
  success: false;
  error: string;
  message: string;
  code: AuthErrorCode;
  timestamp: string;
}

/**
 * Auth Error Codes
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_EMAIL'
  | 'WEAK_PASSWORD'
  | 'USER_NOT_FOUND'
  | 'USER_NOT_ACTIVE'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'REGISTRATION_NOT_FOUND'
  | 'ALREADY_REGISTERED'
  | 'INTERNAL_SERVER_ERROR';

// ============================================
// DATABASE MODELS
// ============================================

/**
 * User Database Record
 */
export interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  role_id?: number;
  assigned_at?: Date;
  assigned_by?: number;
  kyc_level: KycLevel;
  kyc_status: KycStatus;
  kyc_verified_at?: Date;
  kyc_verified_by?: number;
  kyc_expires_at?: Date;
  investor_tier?: string;
  phone?: string;
  country?: string;
  language: string;
  organization_name?: string;
  organization_type?: string;
  tax_id?: string;
  wallet_address?: string;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  email_verified: boolean;
  email_verified_at?: Date;
  partnership_id?: number;
  partner_manager_id?: number;
  is_active: boolean;
  admin_notes?: string;
  rejection_reason?: string;
  rejection_date?: Date;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  last_activity?: Date;
}

/**
 * Pending Registration Record
 */
export interface PendingRegistrationRecord {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  organization_name?: string;
  organization_type?: string;
  phone?: string;
  country?: string;
  language: string;
  status: RegistrationStatus;
  created_at: Date;
  submitted_at: Date;
  reviewed_at?: Date;
  reviewed_by?: number;
  rejection_reason?: string;
  admin_notes?: string;
}

// ============================================
// TWO-FACTOR AUTHENTICATION (2FA)
// ============================================

/**
 * 2FA Setup Request
 */
export interface TwoFactorSetupRequest {
  email: string;
}

/**
 * 2FA Setup Response
 */
export interface TwoFactorSetupResponse {
  success: boolean;
  secret: string;
  qrCode: string;
  manualEntryKey: string;
  backupCodes: string[];
}

/**
 * 2FA Verify Setup Request (during initial setup)
 */
export interface TwoFactorVerifySetupRequest {
  secret: string;
  token: string;
  backupCodes: string[];
}

/**
 * 2FA Verify Request (during login)
 */
export interface TwoFactorVerifyRequest {
  email: string;
  token: string;
  isBackupCode?: boolean;
}

/**
 * 2FA Verify Response
 */
export interface TwoFactorVerifyResponse {
  success: boolean;
  message: string;
  valid: boolean;
  remainingBackupCodes?: number;
}

/**
 * 2FA Enable Request (complete setup)
 */
export interface TwoFactorEnableRequest {
  secret: string;
  token: string;
  backupCodes: string[];
}

/**
 * 2FA Enable Response
 */
export interface TwoFactorEnableResponse {
  success: boolean;
  message: string;
  twoFactorEnabled: boolean;
}

/**
 * 2FA Disable Request
 */
export interface TwoFactorDisableRequest {
  password: string;
  token?: string;
}

/**
 * 2FA Disable Response
 */
export interface TwoFactorDisableResponse {
  success: boolean;
  message: string;
  twoFactorEnabled: boolean;
}

/**
 * 2FA Status Response
 */
export interface TwoFactorStatusResponse {
  success: boolean;
  enabled: boolean;
  backupCodesCount?: number;
}

/**
 * Regenerate Backup Codes Request
 */
export interface RegenerateBackupCodesRequest {
  password: string;
}

/**
 * Regenerate Backup Codes Response
 */
export interface RegenerateBackupCodesResponse {
  success: boolean;
  backupCodes: string[];
}
