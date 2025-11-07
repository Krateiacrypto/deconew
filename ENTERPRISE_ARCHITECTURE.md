# 🏢 ENTERPRISE ARCHITECTURE - Decarbonize Backend System

> **Tarih**: 29 Ekim 2025
> **Durum**: Kurumsal mimarisi tasarımı tamamlanmış
> **Stack**: Node.js/Express + MySQL 8.0 + JWT + TypeScript
> **Deployment**: Self-hosted (Kendi hosting)

---

## 📋 EXECUTİVE SUMMARY

Decarbonize platformu **kurumsal sınıf** bir blockchain-based karbon kredi yatırım platformu olarak yeniden mimarlandı:

- ✅ **Bağımsız MySQL Backend**: Kendi hosting'de tam kontrol
- ✅ **Dinamik Role Management**: Superadmin kurumsal anlaşmalara göre roller oluşturabilir
- ✅ **Enterprise Partnerships**: B2B integrations, custom permissions
- ✅ **Advanced KYC/AML**: 3-level kurumsal doğrulama
- ✅ **Audit Trail**: Tam compliance logging
- ✅ **API-First Architecture**: Frontend/Backend tamamen ayrı

---

## 🏗️ SİSTEM MİMARİSİ

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (React)                   │
│          (D:\Decarbonize - Mevcut Frontend Korunur)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Calls (REST + JWT)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│             BACKEND API LAYER (Node.js/Express)             │
│          (D:\Decarbonize\backend - Yeni Backend)            │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Controllers (Auth, Admin, User, Partnership, Roles)   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                         ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Services (Auth, User, Permission, Audit, Email)       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                         ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Middleware (JWT Auth, RBAC, Error Handling)           │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ SQL Queries
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER (MySQL)                      │
│                   (Kendi Hosting)                            │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │    users     │ │    roles     │ │ permissions  │        │
│  │  (pending)   │ │  (dynamic)   │ │  (granular)  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ partnerships │ │ kyc_profiles │ │  audit_logs  │        │
│  │ (B2B mgmt)   │ │ (3-level)    │ │ (compliance) │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   projects   │ │ investments  │ │   tokens     │        │
│  │              │ │              │ │  (on-chain)  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ Smart Contract Calls (ethers.js)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN LAYER (ReefChain)                    │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  DCB Token   │ │  CO2 Token   │ │ ICO Contract │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   Staking    │ │   Trading    │ │  Vesting     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 ADVANCED USER ROLE SYSTEM

### 1. ROLE KATEGORİLERİ

```
┌─────────────────────────────────────────┐
│     USER ROLE HIERARCHY (11 Roles)      │
├─────────────────────────────────────────┤
│                                         │
│  TIER 0: SYSTEM ADMINISTRATORS          │
│  ├─ superadmin (Tam kontrol)            │
│  └─ admin (Platform yönetimi)           │
│                                         │
│  TIER 1: INSTITUTIONAL PARTNERS         │
│  ├─ institutional_investor (Large cap)  │
│  ├─ carbon_provider (Project issuer)    │
│  └─ ngo (Environmental projects)        │
│                                         │
│  TIER 2: PROFESSIONAL USERS             │
│  ├─ advisor (Investment advisor)        │
│  ├─ verifier (Project verification)     │
│  └─ pro_investor (Advanced trading)     │
│                                         │
│  TIER 3: RETAIL USERS                   │
│  ├─ free_investor (Basic tier)          │
│  ├─ web_admin (Content management)      │
│  └─ user (Default user)                 │
│                                         │
└─────────────────────────────────────────┘
```

### 2. ENTERPRISE PARTNERSHIP ROLES (Dynamic)

Superadmin aşağıdaki gibi **custom roles** oluşturabilir:

```typescript
// Örnek: Global Fortune 500 şirketi partnership
{
  role_code: "partner_shell_global",
  role_name: "Shell Global Partnership",
  parent_role: "institutional_investor",

  permissions: [
    "invest:unlimited",
    "portfolio:priority_access",
    "trading:advanced",
    "reporting:custom_analytics",
    "api:enterprise_access",
    "kyc:institutional_level_3"
  ],

  restrictions: {
    max_projects_per_month: null,  // unlimited
    min_investment: 1000000,        // $1M minimum
    monthly_volume_limit: null,     // unlimited
    dedicated_manager: true,
    custom_contracts: true,
    api_rate_limit: 100000          // per hour
  },

  metadata: {
    partner_since: "2025-01-15",
    partner_tier: "platinum",
    account_manager: "user_id_xxx",
    contract_url: "https://..."
  }
}
```

### 3. USER REGISTRATION WORKFLOW (Kurumsal)

```
┌──────────────────────────────────────────┐
│ 1. USER REGISTERS                        │
│    - Email, Password, Basic Info         │
│    - Status: PENDING_APPROVAL            │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ 2. EMAIL VERIFICATION (İsteğe bağlı)    │
│    - Verify email token                  │
│    - Status: EMAIL_VERIFIED              │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ 3. SUPERADMIN REVIEW                     │
│    ├─ Check KYC requirements             │
│    ├─ Select appropriate role            │
│    ├─ If partnership: apply custom role  │
│    └─ Status: UNDER_REVIEW               │
└────────────┬─────────────────────────────┘
             │
        ┌────┴────┐
        ↓         ↓
   ┌────────┐ ┌───────────┐
   │APPROVE │ │  REJECT   │
   └────┬───┘ └─────┬─────┘
        │           │
        ↓           ↓
   ┌─────────┐  ┌─────────────┐
   │ ACTIVE  │  │  REJECTED   │
   │Status   │  │  Status     │
   └─────────┘  └─────────────┘
        │
        ├─ Assign Role
        ├─ Set Tier (if investor)
        ├─ Set KYC Level
        ├─ Create Wallet Entry
        ├─ Send Welcome Email
        └─ Log to Audit Trail
```

---

## 🗄️ DATABASE SCHEMA (Enterprise Grade)

### Users Table (Extended)

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Status Workflow
  status ENUM('pending_approval', 'email_verified', 'under_review',
               'active', 'suspended', 'rejected', 'archived')
         DEFAULT 'pending_approval',

  -- Role Assignment (by superadmin)
  role_id BIGINT,  -- Foreign key to roles table
  assigned_at TIMESTAMP NULL,
  assigned_by BIGINT,  -- superadmin user_id

  -- KYC & Compliance
  kyc_level ENUM('level_1', 'level_2', 'level_3') DEFAULT 'level_1',
  kyc_status ENUM('pending', 'approved', 'rejected', 'expired', 'under_review')
             DEFAULT 'pending',
  kyc_verified_at TIMESTAMP NULL,
  kyc_verified_by BIGINT,
  kyc_expires_at TIMESTAMP NULL,

  -- Investor Tier (if applicable)
  investor_tier ENUM('free', 'pro', 'institutional') NULL,
  minimum_investment DECIMAL(18, 2) NULL,
  monthly_limit DECIMAL(18, 2) NULL,
  trading_fee_rate DECIMAL(5, 4) NULL,
  staking_multiplier DECIMAL(3, 2) NULL,
  tier_upgraded_at TIMESTAMP NULL,

  -- Contact Information
  phone VARCHAR(20),
  country VARCHAR(100),
  language ENUM('tr', 'en', 'de', 'fr') DEFAULT 'tr',

  -- Organization Details (for corporate users)
  organization_name VARCHAR(255),
  organization_type ENUM('individual', 'company', 'ngo', 'financial_institution'),
  tax_id VARCHAR(50),

  -- Blockchain
  wallet_address VARCHAR(255) UNIQUE,

  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP NULL,

  -- Partnership Information
  partnership_id BIGINT,  -- Foreign key (nullable)
  partner_manager_id BIGINT,  -- Assigned account manager

  -- Administrative
  is_active BOOLEAN DEFAULT TRUE,
  admin_notes TEXT,
  rejection_reason TEXT,
  rejection_date TIMESTAMP NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  last_activity TIMESTAMP NULL,

  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_role_id (role_id),
  INDEX idx_organization (organization_name),
  INDEX idx_created_at (created_at),
  INDEX idx_partnership_id (partnership_id),

  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id),
  FOREIGN KEY (kyc_verified_by) REFERENCES users(id),
  FOREIGN KEY (partner_manager_id) REFERENCES users(id),
  FOREIGN KEY (partnership_id) REFERENCES partnerships(id)
);
```

### Roles Table (Dynamic)

```sql
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_code VARCHAR(50) UNIQUE NOT NULL,  -- e.g., 'institutional_investor', 'partner_shell_global'
  role_name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Role Hierarchy
  parent_role_id BIGINT,  -- For role inheritance
  role_tier ENUM('system', 'institutional', 'professional', 'retail')
            DEFAULT 'retail',

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Permissions (JSON for flexibility)
  permissions JSON,  -- Array of permission codes

  -- Restrictions (Enterprise)
  restrictions JSON,  -- {max_projects, min_investment, api_limit, etc}

  -- Metadata
  metadata JSON,  -- {partner_since, partner_tier, etc}

  -- System role flag
  is_system_role BOOLEAN DEFAULT FALSE,  -- Can't be deleted

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,

  INDEX idx_role_code (role_code),
  INDEX idx_parent_role_id (parent_role_id),
  FOREIGN KEY (parent_role_id) REFERENCES roles(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### Partnerships Table (B2B Management)

```sql
CREATE TABLE partnerships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  partner_name VARCHAR(255) NOT NULL,
  partner_type ENUM('investor', 'provider', 'distributor', 'technology', 'other'),

  -- Legal
  legal_entity_name VARCHAR(255),
  registration_number VARCHAR(100),
  tax_id VARCHAR(50),
  country VARCHAR(100),

  -- Contract
  contract_start_date DATE,
  contract_end_date DATE,
  contract_document_url VARCHAR(500),

  -- Partnership Role
  custom_role_id BIGINT,  -- Links to dynamic role created for this partnership

  -- Commercial Terms
  commission_rate DECIMAL(5, 4),
  minimum_volume DECIMAL(18, 2),
  volume_discount_tiers JSON,  -- [{threshold: 1000000, discount: 0.05}, ...]

  -- Account Management
  primary_contact_name VARCHAR(100),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(20),
  account_manager_id BIGINT,  -- superadmin assigned manager

  -- Status
  status ENUM('active', 'pending', 'suspended', 'terminated'),

  -- Metadata
  metadata JSON,  -- Additional partnership data

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,

  INDEX idx_partner_name (partner_name),
  INDEX idx_status (status),
  INDEX idx_custom_role_id (custom_role_id),
  FOREIGN KEY (custom_role_id) REFERENCES roles(id),
  FOREIGN KEY (account_manager_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Permissions Table (Granular Control)

```sql
CREATE TABLE permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  permission_code VARCHAR(100) UNIQUE NOT NULL,
  permission_name VARCHAR(150),
  category ENUM('user_management', 'project_management', 'financial',
                'analytics', 'smart_contract', 'content_management',
                'compliance', 'partnership') DEFAULT 'user_management',
  description TEXT,

  is_system_permission BOOLEAN DEFAULT FALSE,  -- Can't be deleted

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_permission_code (permission_code)
);
```

### KYC Profiles Table (3-Level)

```sql
CREATE TABLE kyc_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,

  -- Level 1: Basic
  level_1_completed BOOLEAN DEFAULT FALSE,
  level_1_data JSON,  -- {firstName, lastName, dateOfBirth, nationality}
  level_1_submitted_at TIMESTAMP NULL,
  level_1_approved_at TIMESTAMP NULL,

  -- Level 2: Intermediate
  level_2_completed BOOLEAN DEFAULT FALSE,
  level_2_data JSON,  -- {address, city, postalCode, identityDoc}
  level_2_submitted_at TIMESTAMP NULL,
  level_2_approved_at TIMESTAMP NULL,

  -- Level 3: Institutional
  level_3_completed BOOLEAN DEFAULT FALSE,
  level_3_data JSON,  -- {companyReg, taxId, beneficialOwners, bankInfo}
  level_3_submitted_at TIMESTAMP NULL,
  level_3_approved_at TIMESTAMP NULL,

  -- Verification
  verification_method ENUM('online_id', 'video_call', 'document_review'),
  verified_by BIGINT,
  verification_date TIMESTAMP NULL,

  -- Status
  overall_status ENUM('pending', 'approved', 'rejected', 'under_review', 'expired'),
  rejection_reason TEXT,

  -- Expiry
  expires_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_overall_status (overall_status),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (verified_by) REFERENCES users(id)
);
```

### Audit Logs Table (Compliance)

```sql
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),  -- 'user', 'role', 'permission', 'partnership'
  resource_id BIGINT,

  old_values JSON,
  new_values JSON,

  ip_address VARCHAR(45),
  user_agent TEXT,

  status ENUM('success', 'failed', 'partial') DEFAULT 'success',
  error_message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Pending Registrations Table

```sql
CREATE TABLE pending_registrations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Request Info
  requested_role VARCHAR(50),
  organization_name VARCHAR(255),
  organization_type ENUM('individual', 'company', 'ngo', 'financial_institution'),

  -- Contact
  phone VARCHAR(20),
  country VARCHAR(100),

  -- Additional Info
  purpose_of_use TEXT,
  how_heard_about_us VARCHAR(100),
  additional_data JSON,

  -- Email Verification
  email_token VARCHAR(255) UNIQUE,
  email_token_expires_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,

  -- Admin Review
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by BIGINT,

  -- Decision
  status ENUM('pending', 'approved', 'rejected', 'requires_more_info')
         DEFAULT 'pending',
  approval_notes TEXT,
  rejection_reason TEXT,

  -- If approved, link to actual user
  user_id BIGINT,

  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION FLOW

### JWT Token Structure

```typescript
// Access Token (1 hour)
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "institutional_investor",
  "role_id": 123,
  "permissions": ["invest:unlimited", "portfolio:view", ...],
  "partnership_id": 456,  // if applicable
  "kyc_level": "level_3",
  "iat": 1698764400,
  "exp": 1698768000
}

// Refresh Token (7 days)
{
  "sub": "user_id",
  "type": "refresh",
  "iat": 1698764400,
  "exp": 1699369200
}
```

### Authorization Middleware (RBAC + ABAC)

```typescript
// Role-Based Access Control (RBAC)
middleware.authorize(['institutional_investor', 'admin'])

// Attribute-Based Access Control (ABAC)
middleware.authorize(
  {
    role: 'institutional_investor',
    kyc_level: 'level_3',
    min_investment: 1000000
  }
)

// Permission-Based
middleware.authorize('invest:unlimited')
```

---

## 🚀 API ENDPOINTS (Complete List)

### Authentication Endpoints

```
POST   /api/auth/register              # Register with email/password
POST   /api/auth/login                 # Login (returns JWT)
POST   /api/auth/refresh-token         # Refresh access token
POST   /api/auth/logout                # Logout
POST   /api/auth/verify-email          # Email verification
POST   /api/auth/forgot-password       # Password reset request
POST   /api/auth/reset-password        # Reset password with token
```

### Superadmin Endpoints

```
# Registration Management
GET    /api/admin/registrations/pending      # List pending registrations
POST   /api/admin/registrations/:id/approve  # Approve & assign role
POST   /api/admin/registrations/:id/reject   # Reject registration

# User Management
GET    /api/admin/users                      # List all users (paginated)
GET    /api/admin/users/:id                  # Get user details
PUT    /api/admin/users/:id                  # Update user
POST   /api/admin/users/:id/suspend          # Suspend user
POST   /api/admin/users/:id/unsuspend        # Unsuspend user
DELETE /api/admin/users/:id                  # Archive user

# Role Management (Dynamic)
GET    /api/admin/roles                      # List all roles
POST   /api/admin/roles                      # Create custom role
GET    /api/admin/roles/:id                  # Get role details
PUT    /api/admin/roles/:id                  # Update role
DELETE /api/admin/roles/:id                  # Delete custom role (not system)

# Permission Management
GET    /api/admin/permissions                # List all permissions
POST   /api/admin/roles/:id/permissions      # Add permission to role
DELETE /api/admin/roles/:id/permissions/:pid # Remove permission from role

# Partnership Management
GET    /api/admin/partnerships               # List partnerships
POST   /api/admin/partnerships               # Create partnership
GET    /api/admin/partnerships/:id           # Get partnership details
PUT    /api/admin/partnerships/:id           # Update partnership
POST   /api/admin/partnerships/:id/users     # Assign users to partnership

# KYC Management
GET    /api/admin/kyc/pending                # List pending KYC
GET    /api/admin/kyc/:id                    # Get KYC details
POST   /api/admin/kyc/:id/approve            # Approve KYC
POST   /api/admin/kyc/:id/reject             # Reject KYC

# Audit & Compliance
GET    /api/admin/audit-logs                 # View audit logs
GET    /api/admin/stats                      # Platform statistics
```

### User Endpoints

```
# Profile
GET    /api/user/profile                     # Get own profile
PUT    /api/user/profile                     # Update profile
GET    /api/user/profile/settings            # Get settings

# Security
PUT    /api/user/password                    # Change password
POST   /api/user/2fa/setup                   # Setup 2FA
POST   /api/user/2fa/verify                  # Verify 2FA
POST   /api/user/2fa/disable                 # Disable 2FA

# KYC
GET    /api/user/kyc/status                  # Get KYC status
POST   /api/user/kyc/level1/submit           # Submit Level 1
POST   /api/user/kyc/level2/submit           # Submit Level 2
POST   /api/user/kyc/level3/submit           # Submit Level 3

# Wallet
GET    /api/user/wallet                      # Get wallet info
POST   /api/user/wallet/connect              # Connect blockchain wallet

# Notifications
GET    /api/user/notifications               # Get notifications
POST   /api/user/notifications/:id/read      # Mark as read
```

### Public Endpoints

```
GET    /api/public/partnerships              # List active partnerships
GET    /api/public/features                  # Platform features
GET    /api/public/health                    # Health check
```

---

## 🛠️ PROJECT STRUCTURE

```
decarbonize-backend/
├── src/
│   ├── config/
│   │   ├── database.ts              # MySQL connection pool
│   │   ├── jwt.ts                   # JWT configuration
│   │   ├── email.ts                 # Email service config
│   │   ├── constants.ts             # App constants
│   │   └── environment.ts           # Env variables validation
│   │
│   ├── controllers/
│   │   ├── authController.ts        # Auth endpoints
│   │   ├── adminController.ts       # Admin endpoints
│   │   ├── userController.ts        # User endpoints
│   │   ├── roleController.ts        # Role management
│   │   ├── partnershipController.ts # Partnership management
│   │   ├── kycController.ts         # KYC endpoints
│   │   └── auditController.ts       # Audit logs
│   │
│   ├── services/
│   │   ├── authService.ts           # Auth business logic
│   │   ├── userService.ts           # User operations
│   │   ├── roleService.ts           # Role management logic
│   │   ├── permissionService.ts     # Permission checks
│   │   ├── partnershipService.ts    # Partnership logic
│   │   ├── kycService.ts            # KYC verification
│   │   ├── emailService.ts          # Email sending
│   │   ├── auditService.ts          # Audit logging
│   │   ├── jwtService.ts            # Token generation
│   │   └── blockchainService.ts     # Smart contract interactions
│   │
│   ├── models/
│   │   ├── User.ts                  # User model/queries
│   │   ├── Role.ts                  # Role model
│   │   ├── Permission.ts            # Permission model
│   │   ├── Partnership.ts           # Partnership model
│   │   ├── KYCProfile.ts            # KYC model
│   │   ├── AuditLog.ts              # Audit log model
│   │   └── PendingRegistration.ts   # Pending reg model
│   │
│   ├── middleware/
│   │   ├── authenticate.ts          # JWT verification
│   │   ├── authorize.ts             # RBAC/ABAC checks
│   │   ├── errorHandler.ts          # Global error handling
│   │   ├── validation.ts            # Request validation
│   │   ├── audit.ts                 # Audit logging middleware
│   │   └── cors.ts                  # CORS configuration
│   │
│   ├── routes/
│   │   ├── auth.ts                  # /api/auth routes
│   │   ├── admin.ts                 # /api/admin routes
│   │   ├── user.ts                  # /api/user routes
│   │   ├── roles.ts                 # /api/admin/roles
│   │   ├── partnerships.ts          # /api/admin/partnerships
│   │   ├── kyc.ts                   # /api/kyc routes
│   │   └── public.ts                # /api/public routes
│   │
│   ├── utils/
│   │   ├── logger.ts                # Logging utility
│   │   ├── validators.ts            # Input validation
│   │   ├── emailTemplates.ts        # Email templates
│   │   ├── permissions.ts           # Permission helpers
│   │   ├── cryptography.ts          # Password hashing, etc
│   │   ├── errors.ts                # Custom error classes
│   │   └── helpers.ts               # Utility helpers
│   │
│   ├── types/
│   │   ├── index.ts                 # TypeScript types
│   │   ├── express.d.ts             # Express extensions
│   │   ├── jwt.ts                   # JWT payload types
│   │   └── api.ts                   # API request/response types
│   │
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_roles.sql
│   │   ├── 003_create_permissions.sql
│   │   ├── 004_create_kyc_profiles.sql
│   │   ├── 005_create_partnerships.sql
│   │   ├── 006_create_audit_logs.sql
│   │   └── 007_create_pending_registrations.sql
│   │
│   └── index.ts                     # Express app entry point
│
├── tests/
│   ├── auth.test.ts
│   ├── admin.test.ts
│   ├── user.test.ts
│   └── integration.test.ts
│
├── .env.example
├── .env.local
├── .env.production
├── package.json
├── tsconfig.json
├── eslint.config.js
├── jest.config.js
└── README.md
```

---

## 🔄 WORKFLOW EXAMPLES

### Example 1: Enterprise Partnership Setup

```
1. Global corporation wants to invest
2. Superadmin creates partnership record
   - Legal entity name: "Shell Global BV"
   - Contract: $50M minimum annual volume
   - Commission: 0.5%
   - Volume discounts: tier-based

3. Superadmin creates custom role
   - role_code: "partner_shell_global"
   - parent_role: "institutional_investor"
   - permissions: [invest:unlimited, portfolio:priority, ...]
   - restrictions: {min_investment: $1M, api_rate_limit: 100k/hour}

4. Shell employees register through platform
   - Status: pending_approval
   - Requested role: "enterprise_partner"

5. Superadmin approves with role assignment
   - Assign role: "partner_shell_global"
   - Set partnership_id
   - Set account_manager
   - Status: active

6. Employees can now invest with partnership benefits
   - Custom fee structure
   - Dedicated account manager
   - Priority support
```

### Example 2: Institutional Investor KYC

```
1. User registers (individual)
   - Status: pending_approval
   - KYC Level: level_1

2. Superadmin approves registration
   - Assign role: "institutional_investor"
   - Status: active

3. User completes KYC Level 1
   - Personal info, ID document
   - Status: level_1_completed

4. User completes KYC Level 2
   - Address, proof of funds
   - Status: level_2_completed

5. User completes KYC Level 3 (institutional)
   - Company registration, beneficial owners
   - Bank account verification
   - Status: level_3_completed

6. Superadmin reviews & approves Level 3
   - Sets: kyc_status = 'approved'
   - User can now access all features
   - Audit log: "KYC_LEVEL_3_APPROVED"
```

---

## 📊 LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn
- Postman (for API testing)

### Quick Start

```bash
# 1. Clone backend repo
git clone <backend-repo> d:\Decarbonize\backend
cd d:\Decarbonize\backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with MySQL credentials

# 4. Create MySQL database
mysql -u root -p
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4;
EXIT;

# 5. Run migrations
npm run migrate

# 6. Seed demo data (optional)
npm run seed

# 7. Start dev server
npm run dev
# Server runs on http://localhost:3001

# 8. Frontend integration
cd d:\Decarbonize
npm run dev
# Frontend runs on http://localhost:5173
```

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=decarbonize_dev

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_here
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters_long_here
JWT_ACCESS_EXPIRY=3600
JWT_REFRESH_EXPIRY=604800

# Email
MAIL_FROM=noreply@decarbonize.world
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Blockchain
REEF_CHAIN_RPC=https://rpc.reefscan.com
REEF_CHAIN_EXPLORER=https://reefscan.com

# Frontend
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://decarbonize.world

# Server
NODE_ENV=development
SERVER_PORT=3001
SERVER_HOST=localhost

# Logging
LOG_LEVEL=debug
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Backend Setup & Infrastructure
- [ ] Initialize Node.js project with TypeScript
- [ ] Setup MySQL database and create schema
- [ ] Create environment variables
- [ ] Setup logging and error handling
- [ ] Create database models

### Phase 2: Authentication & Core Features
- [ ] Implement registration endpoint (pending status)
- [ ] Implement login endpoint (status check)
- [ ] Implement email verification
- [ ] Implement JWT generation & refresh
- [ ] Implement logout

### Phase 3: Admin & Role Management
- [ ] Create admin registration approval workflow
- [ ] Implement dynamic role creation
- [ ] Implement role assignment
- [ ] Implement permission management
- [ ] Create partnership management endpoints

### Phase 4: Advanced Features
- [ ] 3-level KYC system
- [ ] Audit logging system
- [ ] 2FA implementation
- [ ] Email notifications
- [ ] API documentation (Swagger)

### Phase 5: Testing & Integration
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Postman collection
- [ ] Frontend integration
- [ ] Local testing with all roles

### Phase 6: Production Deployment
- [ ] Environment-specific configs
- [ ] Database backups
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Monitoring & alerts

---

## 🔒 SECURITY CONSIDERATIONS

1. **Password Hashing**: bcryptjs (cost: 12)
2. **CORS**: Restrict to frontend URL only
3. **Rate Limiting**: Implement for auth endpoints
4. **SQL Injection**: Use parameterized queries
5. **CSRF Protection**: Include CSRF tokens
6. **JWT**: Secure secret keys (min 32 chars)
7. **HTTPS**: Enforce in production
8. **Audit Logging**: All admin actions logged
9. **Input Validation**: Joi/express-validator on all inputs
10. **Database**: Encrypted passwords, NO sensitive data in logs

---

## 📈 SCALABILITY & PERFORMANCE

- Connection pooling (MySQL)
- Redis caching (optional, for sessions)
- Pagination for list endpoints
- Indexes on frequently queried columns
- Async/await for non-blocking I/O
- Error recovery mechanisms
- Load testing recommendations

---

## 📞 NEXT STEPS

1. **Approve Architecture** - Confirm design is acceptable
2. **Setup Backend Project** - Initialize with TypeScript
3. **Create Database Schema** - Run migrations
4. **Implement Authentication** - Core login/register
5. **Create Admin Panel** - Registration approval
6. **Test Locally** - Postman collection
7. **Integrate Frontend** - Update React app
8. **Deploy** - Production environment

---

**Doküman Sürümü**: 1.0
**Son Güncelleme**: 29 Ekim 2025
**Durum**: ✅ READY FOR IMPLEMENTATION
