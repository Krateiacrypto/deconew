// ============================================
// USER TYPES
// ============================================

export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'institutional_investor'
  | 'pro_investor'
  | 'free_investor'
  | 'carbon_provider'
  | 'verifier'
  | 'advisor'
  | 'ngo'
  | 'web_admin'
  | 'user';

export type UserStatus =
  | 'pending_approval'
  | 'email_verified'
  | 'under_review'
  | 'active'
  | 'suspended'
  | 'rejected'
  | 'archived';

export type KYCLevel = 'level_1' | 'level_2' | 'level_3';
export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'under_review';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;

  role: UserRole | null;
  roleId: number | null;
  status: UserStatus;

  kycLevel: KYCLevel;
  kycStatus: KYCStatus;

  phone?: string;
  country?: string;
  language: 'tr' | 'en' | 'de' | 'fr';

  organizationName?: string;
  organizationType?: string;
  walletAddress?: string;

  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActivity?: Date;
}

// ============================================
// ROLE TYPES
// ============================================

export type RoleTier = 'system' | 'institutional' | 'professional' | 'retail';

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  parentRoleId?: number;
  roleTier: RoleTier;
  isActive: boolean;
  isSystemRole: boolean;
  permissions?: string[];
  restrictions?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number;
  updatedBy?: number;
}

// ============================================
// PERMISSION TYPES
// ============================================

export type PermissionCategory =
  | 'user_management'
  | 'project_management'
  | 'financial'
  | 'analytics'
  | 'smart_contract'
  | 'content_management'
  | 'compliance'
  | 'partnership';

export interface Permission {
  id: number;
  permissionCode: string;
  permissionName: string;
  category: PermissionCategory;
  description?: string;
  isSystemPermission: boolean;
  createdAt: Date;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: UserPublic;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  organizationType?: string;
  phone?: string;
  country?: string;
  language?: 'tr' | 'en' | 'de' | 'fr';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
  status?: UserStatus;
}

export interface UserPublic {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | null;
  status: UserStatus;
  kycLevel: KYCLevel;
  kycStatus: KYCStatus;
  language: 'tr' | 'en' | 'de' | 'fr';
  country?: string;
  emailVerified: boolean;
}

// ============================================
// JWT TYPES
// ============================================

export interface JWTPayload {
  sub: string;  // user_id
  email: string;
  role: UserRole | null;
  roleId: number | null;
  permissions: string[];
  kycLevel: KYCLevel;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

// ============================================
// PARTNERSHIP TYPES
// ============================================

export interface Partnership {
  id: number;
  partnerName: string;
  partnerType: 'investor' | 'provider' | 'distributor' | 'technology' | 'other';
  legalEntityName?: string;
  registrationNumber?: string;
  taxId?: string;
  country?: string;
  customRoleId?: number;
  contractStartDate?: Date;
  contractEndDate?: Date;
  contractDocumentUrl?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  accountManagerId?: number;
  status: 'active' | 'pending' | 'suspended' | 'terminated';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// KYC TYPES
// ============================================

export interface KYCProfile {
  id: number;
  userId: number;
  level1Completed: boolean;
  level1Data?: Record<string, any>;
  level1SubmittedAt?: Date;
  level1ApprovedAt?: Date;

  level2Completed: boolean;
  level2Data?: Record<string, any>;
  level2SubmittedAt?: Date;
  level2ApprovedAt?: Date;

  level3Completed: boolean;
  level3Data?: Record<string, any>;
  level3SubmittedAt?: Date;
  level3ApprovedAt?: Date;

  verificationMethod?: 'online_id' | 'video_call' | 'document_review';
  verifiedBy?: number;
  verificationDate?: Date;

  overallStatus: KYCStatus;
  rejectionReason?: string;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// AUDIT LOG TYPES
// ============================================

export interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  resourceType?: string;
  resourceId?: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'partial';
  errorMessage?: string;
  createdAt: Date;
}
