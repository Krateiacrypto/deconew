# 🚀 Decarbonize Backend

Enterprise-grade backend for the Decarbonize carbon credit investment platform.

**Tech Stack**: Node.js + Express.js + TypeScript + MySQL 8.0

---

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (copy from .env.example)
cp .env.example .env.local

# 3. Create MySQL database
mysql -u root -p
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4;
CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';
GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Run migrations
npm run migrate

# 5. Start dev server
npm run dev
```

Server starts on `http://localhost:3001`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration modules
│   ├── controllers/       # Route controllers
│   ├── services/         # Business logic
│   ├── models/           # Database queries
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route definitions
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── index.ts          # Express app entry point
│
├── migrations/           # Database migrations
├── seeds/               # Demo data
├── tests/               # Test files
├── .env.local           # Local environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

---

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start dev server with ts-node
npm run build           # Build TypeScript to JavaScript
npm start               # Run built JavaScript

# Database
npm run migrate         # Run database migrations
npm run seed            # Seed demo data

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier

# Testing
npm test                # Run tests
```

---

## 🏗️ Architecture

### API Endpoints

**Health Check**
- `GET /api/health` - Server health check
- `GET /api/health/db` - Database health check

**Authentication** (Coming soon)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

**Admin** (Coming soon)
- `GET /api/admin/registrations/pending` - List pending registrations
- `POST /api/admin/registrations/:id/approve` - Approve registration
- `POST /api/admin/registrations/:id/reject` - Reject registration

### Database Schema

**Tables**
- `users` - User accounts with status workflow
- `roles` - User roles (system + custom partnership roles)
- `permissions` - Granular permission definitions
- `partnerships` - B2B partnership management
- `kyc_profiles` - 3-level KYC verification
- `audit_logs` - Compliance audit trail
- `pending_registrations` - Registration queue

---

## 🔐 Security

- Password hashing with bcryptjs (cost: 12)
- JWT authentication with refresh tokens
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Rate limiting on auth endpoints
- CORS restricted to frontend URL
- SQL injection protection (parameterized queries)
- Audit logging for compliance

---

## 📊 Status Workflow

```
pending_approval → email_verified → under_review → active
                                                  ↓
                                              suspended
                                              rejected
```

Only `active` users can login.

---

## 🚀 Development Notes

### Adding a New Endpoint

1. Create controller in `src/controllers/`
2. Create service in `src/services/`
3. Create route in `src/routes/`
4. Import route in `src/index.ts`

### Database Changes

1. Create migration file in `src/migrations/`
2. Run `npm run migrate`
3. Update type definitions in `src/types/`

### Logging

Use the logger utility:

```typescript
import { logger } from './utils/logger.js';

logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message');
```

---

## 🐛 Troubleshooting

**Cannot connect to MySQL**
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env.local
# Check database exists
mysql -u decarbonize -p decarbonize_dev
```

**Port 3001 already in use**
```bash
# Change in .env.local
SERVER_PORT=3002
```

**TypeScript errors**
```bash
# Clear build and rebuild
rm -rf dist
npm run build
```

---

## 📚 Documentation

- See `ENTERPRISE_ARCHITECTURE.md` for complete technical specification
- See `LOCAL_DEV_SETUP.md` for detailed setup instructions
- See `PROJECT_IMPLEMENTATION_PLAN.md` for development timeline

---

**Version**: 1.0
**Last Updated**: 29 Ekim 2025
**Status**: 🟡 In Development (Phase 1)
