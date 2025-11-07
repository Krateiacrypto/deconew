# 🏗️ BACKEND REQUIREMENTS - MySQL & Node.js Backend

> **Tarih**: 29 Ekim 2025
> **Durum**: Yeni backend architecture tasarımı
> **Stack**: Node.js/Express + MySQL + JWT

---

## 📋 BACKEND GEREK SİNİMLERİ

### 1. TEKNOLOJI STACK

```
Server Framework:    Express.js 4.18+
Language:           TypeScript 5.5+
Database:           MySQL 8.0+
Authentication:     JWT (jsonwebtoken)
Password Hashing:   bcryptjs
Environment:        dotenv
Validation:         joi or express-validator
Database ORM:       Sequelize or TypeORM
API:                RESTful JSON APIs
```

### 2. DATABASE SCHEMA

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),

    -- Account Status
    status ENUM('pending', 'active', 'suspended', 'rejected') DEFAULT 'pending',
    -- pending: Awaiting superadmin approval
    -- active: Approved and can login
    -- suspended: Disabled by admin
    -- rejected: Application rejected

    -- Role (Set by superadmin after approval)
    role ENUM(
        'user',
        'free_investor',
        'pro_investor',
        'institutional_investor',
        'advisor',
        'carbon_provider',
        'verifier',
        'ngo',
        'admin',
        'web_admin',
        'superadmin'
    ) DEFAULT 'user',

    -- Investor Tier (for investor roles)
    investor_tier ENUM('free', 'pro', 'institutional') DEFAULT 'free',

    -- KYC Information
    kyc_status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    kyc_level INT DEFAULT 1, -- 1, 2, 3

    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,

    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255) NULL,
    backup_codes JSON NULL,

    -- Profile
    avatar_url VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    country VARCHAR(100) NULL,
    language ENUM('tr', 'en', 'de', 'fr') DEFAULT 'tr',

    -- Organization (for business roles)
    organization_name VARCHAR(255) NULL,
    organization_type VARCHAR(100) NULL,
    certifications JSON NULL,
    specializations JSON NULL,

    -- Blockchain
    wallet_address VARCHAR(255) NULL,

    -- Admin Notes
    admin_notes TEXT NULL,
    rejection_reason TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);
```

#### Permissions Table
```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,

    UNIQUE KEY unique_role_permission (role, permission),
    INDEX idx_role (role)
);

-- Permission structure
-- Format: "module:action"
-- Examples:
-- users:create, users:read, users:update, users:delete
-- projects:create, projects:approve, projects:reject
-- kyc:review, kyc:approve
-- admin:manage_users, admin:view_logs
-- blog:create, blog:edit, blog:publish
```

#### Roles Table
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    permissions JSON, -- Array of permission IDs or names
    is_system_role BOOLEAN DEFAULT FALSE, -- Can't be deleted

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Pending Registrations Table
```sql
CREATE TABLE pending_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    requested_role VARCHAR(50), -- user, investor, provider, etc.

    -- Profile Info
    phone VARCHAR(20) NULL,
    country VARCHAR(100) NULL,

    -- Business Info (if applicable)
    organization_name VARCHAR(255) NULL,
    organization_type VARCHAR(100) NULL,

    -- Additional Data
    extra_data JSON NULL, -- Any other registration data

    -- Verification
    email_token VARCHAR(255) UNIQUE,
    email_token_expires_at TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,

    -- Admin Review
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT NULL, -- superadmin user id

    -- Decision
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approval_notes TEXT NULL,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
```

#### Audit Log Table
```sql
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'user', 'role', 'permission', etc.
    entity_id INT NULL,

    old_values JSON NULL,
    new_values JSON NULL,

    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 3. API ENDPOINTS

### Authentication Endpoints

#### POST /api/auth/register
Yeni kullanıcı kaydı (pending durumunda)
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+905551234567",
  "country": "Turkey",
  "requested_role": "user", // or "free_investor", "provider", "advisor"
  "language": "tr"
}

Response (201):
{
  "success": true,
  "message": "Registration successful. Awaiting admin approval.",
  "user_id": 1,
  "status": "pending",
  "email_verification_required": true
}

Response (400):
{
  "success": false,
  "error": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

#### POST /api/auth/login
Kullanıcı giriş
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "status": "active"
  },
  "expires_in": 3600
}

Response (401):
{
  "success": false,
  "error": "Account pending approval",
  "code": "ACCOUNT_PENDING"
}
```

#### POST /api/auth/verify-email
Email doğrulama
```json
Request:
{
  "token": "email_verification_token_from_email"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### POST /api/auth/refresh-token
Token yenileme
```json
Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "success": true,
  "token": "new_jwt_token",
  "expires_in": 3600
}
```

#### POST /api/auth/logout
Çıkış yapma
```json
Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Admin Endpoints (Superadmin Only)

#### GET /api/admin/registrations/pending
Onay bekleyen kaydıları listele
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "requested_role": "free_investor",
      "submitted_at": "2025-10-29T10:00:00Z",
      "country": "Turkey",
      "phone": "+905551234567",
      "extra_data": {}
    }
  ],
  "total": 5
}
```

#### POST /api/admin/registrations/:id/approve
Kaydı onayla
```json
Request:
{
  "role": "free_investor", // Can override requested_role
  "approval_notes": "Application approved",
  "investor_tier": "free"
}

Response (200):
{
  "success": true,
  "message": "User approved successfully",
  "user_id": 1,
  "status": "active"
}
```

#### POST /api/admin/registrations/:id/reject
Kaydı reddet
```json
Request:
{
  "rejection_reason": "Insufficient documentation"
}

Response (200):
{
  "success": true,
  "message": "User rejected"
}
```

#### GET /api/admin/users
Tüm kullanıcıları listele
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "free_investor",
      "status": "active",
      "kyc_status": "pending",
      "created_at": "2025-10-29T10:00:00Z",
      "last_login": "2025-10-29T14:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20
}
```

#### PUT /api/admin/users/:id
Kullanıcı bilgilerini güncelle
```json
Request:
{
  "role": "pro_investor",
  "status": "active",
  "investor_tier": "pro",
  "kyc_status": "approved",
  "kyc_level": 2,
  "admin_notes": "Upgraded to pro tier"
}

Response (200):
{
  "success": true,
  "message": "User updated successfully"
}
```

#### POST /api/admin/users/:id/suspend
Kullanıcıyı devre dışı bırak
```json
Request:
{
  "reason": "Suspicious activity detected"
}

Response (200):
{
  "success": true,
  "message": "User suspended"
}
```

#### GET /api/admin/audit-logs
Audit loglarını görüntüle
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "user_approved",
      "entity_type": "user",
      "entity_id": 5,
      "old_values": {"status": "pending"},
      "new_values": {"status": "active"},
      "created_at": "2025-10-29T14:30:00Z"
    }
  ]
}
```

#### GET /api/admin/roles
Tüm rolleri listele
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "free_investor",
      "display_name": "Free Investor",
      "description": "Basic investor tier",
      "permissions": ["investments:create", "portfolio:view", "staking:participate"]
    }
  ]
}
```

#### PUT /api/admin/roles/:id
Rol yetkilendirmelerini düzenle
```json
Request:
{
  "permissions": ["investments:create", "investments:delete", "portfolio:view"]
}

Response (200):
{
  "success": true,
  "message": "Role permissions updated"
}
```

---

### User Endpoints (Authenticated)

#### GET /api/user/profile
Kendi profil bilgilerini görüntüle
```json
Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "free_investor",
    "status": "active",
    "kyc_status": "pending",
    "phone": "+905551234567",
    "country": "Turkey",
    "avatar_url": "https://...",
    "language": "tr"
  }
}
```

#### PUT /api/user/profile
Profil bilgilerini güncelle
```json
Request:
{
  "full_name": "John Doe",
  "phone": "+905551234567",
  "country": "Turkey",
  "language": "en"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### PUT /api/user/password
Şifre değiştir
```json
Request:
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### POST /api/user/2fa/setup
2FA başlat
```json
Response (200):
{
  "success": true,
  "secret": "JBSWY3DPEBLW64TMMQ...",
  "qr_code": "data:image/png;base64,iVBORw0KGgo...",
  "backup_codes": ["XXXX-XXXX", "YYYY-YYYY", ...]
}
```

#### POST /api/user/2fa/verify
2FA doğrula
```json
Request:
{
  "token": "123456",
  "backup_codes": ["XXXX-XXXX", "YYYY-YYYY", ...]
}

Response (200):
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

---

## 4. AUTHENTICATION & AUTHORIZATION

### JWT Structure
```javascript
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "1",  // user_id
  "email": "user@example.com",
  "role": "free_investor",
  "permissions": ["investments:create", "portfolio:view"],
  "iat": 1635123600,
  "exp": 1635127200
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

### Token Strategy
- **Access Token**: 1 saat (API requests)
- **Refresh Token**: 7 gün (yeni access token almak için)
- **Email Token**: 24 saat (email doğrulaması)

### Authorization Middleware
```typescript
// Example middleware
const authorize = (requiredPermissions: string[]) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const hasPermission = requiredPermissions.every(perm =>
      decoded.permissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage
app.post('/api/users', authorize(['users:create']), (req, res) => {
  // Only users with 'users:create' permission can access
});
```

---

## 5. ENVIRONMENT VARIABLES

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=decarbonize

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRY=3600  # 1 hour in seconds
JWT_REFRESH_EXPIRY=604800  # 7 days

# Email (for email verification)
MAIL_FROM=noreply@decarbonize.world
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

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

## 6. PROJECT STRUCTURE

```
decarbonize-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MySQL connection
│   │   ├── jwt.ts              # JWT configuration
│   │   └── email.ts            # Email service config
│   │
│   ├── controllers/
│   │   ├── authController.ts    # Auth logic
│   │   ├── adminController.ts   # Admin functions
│   │   ├── userController.ts    # User functions
│   │   └── roleController.ts    # Role management
│   │
│   ├── services/
│   │   ├── authService.ts       # Auth business logic
│   │   ├── userService.ts       # User operations
│   │   ├── emailService.ts      # Email sending
│   │   ├── permissionService.ts # Permission checks
│   │   └── jwtService.ts        # Token management
│   │
│   ├── models/
│   │   ├── User.ts              # User model
│   │   ├── Role.ts              # Role model
│   │   ├── Permission.ts        # Permission model
│   │   ├── PendingRegistration.ts
│   │   └── AuditLog.ts
│   │
│   ├── middleware/
│   │   ├── authenticate.ts      # JWT verification
│   │   ├── authorize.ts         # Permission check
│   │   ├── errorHandler.ts      # Error handling
│   │   └── validation.ts        # Input validation
│   │
│   ├── routes/
│   │   ├── auth.ts              # /api/auth
│   │   ├── admin.ts             # /api/admin
│   │   ├── users.ts             # /api/users
│   │   └── roles.ts             # /api/roles
│   │
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── emailTemplate.ts     # Email templates
│   │   ├── validators.ts        # Input validators
│   │   └── constants.ts         # App constants
│   │
│   ├── types/
│   │   ├── index.ts             # TypeScript types
│   │   ├── express.d.ts         # Express extensions
│   │   └── jwt.ts               # JWT payload types
│   │
│   └── index.ts                 # App entry point
│
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_roles.sql
│   ├── 003_create_permissions.sql
│   └── ...
│
├── tests/
│   ├── auth.test.ts
│   ├── admin.test.ts
│   └── user.test.ts
│
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

---

## 7. ROLE & PERMISSION SYSTEM

### Default Roles

#### 1. Superadmin
```json
{
  "name": "superadmin",
  "permissions": [
    "users:*",
    "roles:*",
    "permissions:*",
    "registrations:approve",
    "registrations:reject",
    "audit:view",
    "system:*"
  ]
}
```

#### 2. Admin
```json
{
  "name": "admin",
  "permissions": [
    "users:read",
    "users:update",
    "users:suspend",
    "projects:approve",
    "projects:reject",
    "kyc:review",
    "kyc:approve",
    "content:manage",
    "audit:view"
  ]
}
```

#### 3. Free Investor
```json
{
  "name": "free_investor",
  "permissions": [
    "profile:update",
    "investments:create",
    "investments:view",
    "portfolio:view",
    "staking:participate"
  ]
}
```

#### 4. Pro Investor
```json
{
  "name": "pro_investor",
  "permissions": [
    "profile:update",
    "investments:create",
    "investments:delete",
    "investments:view",
    "portfolio:view",
    "portfolio:optimize",
    "staking:participate",
    "trading:advanced"
  ]
}
```

---

## 8. SECURITY REQUIREMENTS

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Rate Limiting
- Login attempts: 5 attempts per 15 minutes
- Registration: 3 per hour per IP
- Password reset: 3 per hour per email

### CORS
```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

### Audit Logging
- All admin actions logged
- All user login/logout logged
- All permission changes logged
- IP address and User-Agent recorded

---

## 9. TESTING SETUP

### Local Testing Environment

```sql
-- Test Users (already in pending_registrations)
INSERT INTO pending_registrations VALUES
('superadmin@decarbonize.world', 'hashed_Demo123!@#', 'Super Admin', 'superadmin', ...),
('admin@decarbonize.world', 'hashed_Demo123!@#', 'Admin', 'admin', ...),
('user@decarbonize.world', 'hashed_Demo123!@#', 'Test User', 'user', ...),
...
```

### Test Credentials (After Admin Approval)
```
Email: superadmin@decarbonize.world
Password: Demo123!@#

Email: admin@decarbonize.world
Password: Demo123!@#

Email: user@decarbonize.world
Password: Demo123!@#
```

---

## 10. REQUIRED PACKAGES

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.5.3",
    "mysql2": "^3.6.5",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.7"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "@types/jest": "^29.5.10",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}
```

---

## 11. SETUP INSTRUCTIONS

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation Steps

```bash
# 1. Clone repository
git clone <backend-repo>
cd decarbonize-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Update .env with your MySQL credentials
nano .env

# 5. Create MySQL database
mysql -u root -p
CREATE DATABASE decarbonize;
EXIT;

# 6. Run migrations
npm run migrate

# 7. Seed demo data (optional)
npm run seed

# 8. Start development server
npm run dev

# Server should run on http://localhost:3001
```

---

## 12. MIGRATION COMMANDS

```bash
# Create new migration
npm run migrate:create -- user_creation

# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Check migration status
npm run migrate:status

# Reset database (WARNING: Deletes all data)
npm run migrate:reset
```

---

## 13. API TESTING

### Postman Collection
```json
{
  "info": {
    "name": "Decarbonize API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/login"
          }
        }
      ]
    }
  ]
}
```

---

## 14. DEVELOPMENT CHECKLIST

- [ ] Node.js project initialized with TypeScript
- [ ] MySQL database created and connected
- [ ] Environment variables configured
- [ ] Database migrations created
- [ ] User model implemented
- [ ] Registration flow implemented (pending status)
- [ ] Login flow implemented (with status check)
- [ ] Admin approval endpoints created
- [ ] JWT authentication middleware
- [ ] Authorization middleware with role-based access
- [ ] Error handling middleware
- [ ] Email service configured
- [ ] Audit logging system
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Demo users seeded
- [ ] Production build tested

---

## 15. NEXT STEPS

1. **Setup Backend Project**: Node.js + Express + TypeScript
2. **Configure MySQL**: Create database and tables
3. **Implement Auth System**: Register, Login, Token generation
4. **Create Admin Panel**: Registration approval workflow
5. **Frontend Integration**: Update React app to use new backend
6. **Testing**: Local testing with all user roles
7. **Deployment**: Docker setup for production

---

**Belge Sürümü**: 1.0
**Tarih**: 29 Ekim 2025
**Durum**: REQUIREMENTS COMPLETE - READY FOR IMPLEMENTATION
