# 📋 PROJECT IMPLEMENTATION PLAN - Decarbonize Enterprise Backend

> **Tarih**: 29 Ekim 2025
> **Tahmini Süre**: 6-8 haftalar
> **Başlama**: HEMEN
> **Hedef**: Production-ready backend + integrated frontend

---

## 🎯 PROJECT VISION

**Decarbonize.world** kurumsal sınıf bir blockchain-based karbon kredi yatırım platformudur.

```
MEVCUT DURUM:
✅ React Frontend (Supabase + ReefChain ile çalışıyor)
✅ 11 user role sistemi
✅ KYC, staking, trading, investments
✅ Blog, advisor, partnerships

HEDEF (Bu Plan):
✅ Kendi MySQL backend
✅ Dinamik role management (custom partnership roles)
✅ Superadmin registration approval workflow
✅ Enterprise B2B partnerships
✅ Production deployment ready
```

---

## 📊 HIGH-LEVEL TIMELINE

```
WEEK 1-2: Backend Scaffolding & Database
├─ Node.js project setup
├─ MySQL database schema
├─ Authentication system
└─ Basic CRUD endpoints

WEEK 3: Admin & Role Management
├─ Registration approval workflow
├─ Dynamic role creation
├─ Permission system
└─ Partnership management

WEEK 4: Advanced Features
├─ KYC system (3-level)
├─ Audit logging
├─ Email notifications
└─ 2FA implementation

WEEK 5: Testing & Integration
├─ Postman collection
├─ Frontend integration
├─ Test all user flows
└─ Bug fixes

WEEK 6-8: Polish & Deployment
├─ Performance optimization
├─ Security hardening
├─ Documentation
└─ Production deployment
```

---

## 🚀 PHASE 1: BACKEND SCAFFOLDING (Week 1-2)

### Sprint 1.1: Project Initialization

**Deliverables:**
- ✅ Node.js/TypeScript project structure
- ✅ Database connection pool
- ✅ Environment configuration
- ✅ Logging system
- ✅ Error handling middleware

**Estimated Effort:** 3-4 hours

**Tasks:**
```
1. Create backend folder at D:\Decarbonize\backend
2. Initialize npm project with TypeScript
3. Install all dependencies
4. Create folder structure (src/, migrations/, tests/)
5. Setup .env.local configuration
6. Create database connection module
7. Implement logging utility (Winston)
8. Create error handling middleware
9. Setup Express app entry point
10. Health check endpoint working
```

**Acceptance Criteria:**
- `npm run dev` starts backend on http://localhost:3001
- `http://localhost:3001/api/health` returns OK
- All dependencies installed without errors
- TypeScript compiles without warnings

---

### Sprint 1.2: Database Schema & Migrations

**Deliverables:**
- ✅ MySQL database created
- ✅ All tables with relationships
- ✅ Indexes for performance
- ✅ Migration runner script

**Estimated Effort:** 4-5 hours

**Tables to Create:**
1. `users` - User accounts with status workflow
2. `roles` - Dynamic role definitions
3. `permissions` - Granular permissions
4. `role_permissions` - Role-permission mapping
5. `partnerships` - B2B partnership data
6. `kyc_profiles` - 3-level KYC system
7. `pending_registrations` - Registration queue
8. `audit_logs` - Compliance audit trail
9. `sessions` - JWT session tracking (optional)

**Acceptance Criteria:**
- All 9 tables created with correct schema
- Foreign key relationships working
- Indexes on frequently queried columns
- Migration runner executes all .sql files
- Database can be reset and re-created cleanly

---

### Sprint 1.3: Authentication System (Part 1)

**Deliverables:**
- ✅ Register endpoint (pending status)
- ✅ Login endpoint (with status check)
- ✅ JWT generation & verification
- ✅ Password hashing (bcrypt)

**Estimated Effort:** 5-6 hours

**Endpoints:**
```
POST   /api/auth/register          # Register new user (pending_approval)
POST   /api/auth/login             # Login (check status)
POST   /api/auth/refresh-token     # Refresh JWT
POST   /api/auth/logout            # Logout
POST   /api/auth/verify-email      # Email verification (optional)
```

**Acceptance Criteria:**
- Register creates user with `status: pending_approval`
- Pending users cannot login
- Login returns JWT + refresh token
- JWT payload contains role, permissions, kyc_level
- Refresh token extends session
- Password correctly hashed with bcrypt

---

## 🔐 PHASE 2: ADMIN & ROLE MANAGEMENT (Week 3)

### Sprint 2.1: Registration Approval Workflow

**Deliverables:**
- ✅ Admin dashboard endpoints
- ✅ Pending registrations list
- ✅ Approval/rejection with role assignment

**Estimated Effort:** 4-5 hours

**Endpoints:**
```
GET    /api/admin/registrations/pending           # List pending
POST   /api/admin/registrations/:id/approve       # Approve + assign role
POST   /api/admin/registrations/:id/reject        # Reject with reason
```

**Workflow:**
```
1. User registers → status: pending_approval
2. Superadmin reviews in admin panel
3. Superadmin selects role (investor, provider, etc.)
4. Superadmin clicks "Approve"
   → status: active
   → role_id: assigned
   → email sent to user
5. User can now login
```

**Acceptance Criteria:**
- Pending registrations show in list
- Approval assigns role and sets status to active
- Rejection removes registration or marks rejected
- Audit log created for each action
- Welcome email sent on approval

---

### Sprint 2.2: Dynamic Role Management

**Deliverables:**
- ✅ Role CRUD operations
- ✅ Custom partnership roles
- ✅ Role hierarchy support

**Estimated Effort:** 5-6 hours

**Endpoints:**
```
GET    /api/admin/roles                    # List all roles
POST   /api/admin/roles                    # Create new role
GET    /api/admin/roles/:id                # Get role details
PUT    /api/admin/roles/:id                # Update role
DELETE /api/admin/roles/:id                # Delete custom role

# Permissions
GET    /api/admin/permissions              # List all permissions
POST   /api/admin/roles/:id/permissions    # Add permission to role
DELETE /api/admin/roles/:id/permissions/:pid  # Remove permission
```

**Example: Create Partnership Role**
```json
POST /api/admin/roles
{
  "role_code": "partner_shell_global",
  "role_name": "Shell Global Partnership",
  "parent_role": "institutional_investor",
  "permissions": [
    "invest:unlimited",
    "portfolio:priority_access",
    "trading:advanced",
    "reporting:custom_analytics"
  ],
  "restrictions": {
    "min_investment": 1000000,
    "api_rate_limit": 100000
  },
  "metadata": {
    "partner_tier": "platinum",
    "contract_url": "https://..."
  }
}
```

**Acceptance Criteria:**
- Can create system roles (superadmin, admin, etc.)
- Can create custom partnership roles
- Roles have proper parent-child relationships
- Permissions assigned to roles correctly
- Role deletion blocked for system roles

---

### Sprint 2.3: Partnership Management

**Deliverables:**
- ✅ Partnership CRUD
- ✅ Assign users to partnerships
- ✅ Custom role creation per partnership

**Estimated Effort:** 4-5 hours

**Endpoints:**
```
GET    /api/admin/partnerships             # List partnerships
POST   /api/admin/partnerships             # Create partnership
GET    /api/admin/partnerships/:id         # Get details
PUT    /api/admin/partnerships/:id         # Update
DELETE /api/admin/partnerships/:id         # Delete

POST   /api/admin/partnerships/:id/users   # Assign users to partnership
```

**Acceptance Criteria:**
- Create partnership with legal entity info
- Define contract terms & commission rates
- Automatically create custom role for partnership
- Assign multiple users to partnership
- Users get partnership benefits automatically

---

## ✨ PHASE 3: ADVANCED FEATURES (Week 4)

### Sprint 3.1: KYC System (3-Level)

**Deliverables:**
- ✅ KYC submission endpoints
- ✅ Document upload storage
- ✅ Verification workflow

**Estimated Effort:** 6-7 hours

**Endpoints:**
```
# User side
GET    /api/user/kyc/status                # Get current KYC status
POST   /api/user/kyc/level1/submit         # Submit Level 1
POST   /api/user/kyc/level2/submit         # Submit Level 2
POST   /api/user/kyc/level3/submit         # Submit Level 3

# Admin side
GET    /api/admin/kyc/pending              # List pending KYC reviews
POST   /api/admin/kyc/:id/approve          # Approve KYC level
POST   /api/admin/kyc/:id/reject           # Reject with reason
```

**KYC Levels:**
- **Level 1**: Basic ID + personal info
- **Level 2**: Address proof + selfie
- **Level 3**: Company registration + beneficial owners (institutional)

**Acceptance Criteria:**
- Users can submit each KYC level
- Admin can review and approve/reject
- Each level requires previous level completion
- Documents stored securely (encrypted)
- KYC expiry handled

---

### Sprint 3.2: Audit Logging System

**Deliverables:**
- ✅ Audit middleware
- ✅ All actions logged
- ✅ Compliance reporting

**Estimated Effort:** 3-4 hours

**What to Log:**
- All admin actions (user creation, role assignment, etc.)
- All user authentication events
- All permission changes
- All KYC decisions
- All financial transactions

**Endpoints:**
```
GET    /api/admin/audit-logs               # View audit logs
GET    /api/admin/audit-logs?user=123      # Filter by user
GET    /api/admin/audit-logs?action=login  # Filter by action
```

**Acceptance Criteria:**
- Audit middleware runs on all requests
- Old values and new values captured
- IP address and user agent recorded
- Timestamp precision (milliseconds)
- Logs immutable and tamper-proof

---

### Sprint 3.3: Email & Notifications

**Deliverables:**
- ✅ Email service integration
- ✅ Email templates
- ✅ Notification system

**Estimated Effort:** 4-5 hours

**Email Templates:**
- Welcome email (on registration)
- Approval notification (on role assignment)
- Rejection notification
- KYC submission confirmation
- KYC decision notification
- Password reset
- 2FA verification code

**Acceptance Criteria:**
- All emails sent with correct templates
- Email service (Nodemailer) configured
- HTML emails properly formatted
- Unsubscribe links included
- Email logging for debugging

---

### Sprint 3.4: Two-Factor Authentication (2FA)

**Deliverables:**
- ✅ TOTP setup endpoint
- ✅ QR code generation
- ✅ 2FA verification
- ✅ Backup codes

**Estimated Effort:** 4-5 hours

**Endpoints:**
```
POST   /api/user/2fa/setup                 # Get QR code + secret
POST   /api/user/2fa/verify                # Verify & enable 2FA
POST   /api/user/2fa/disable               # Disable 2FA
POST   /api/auth/login-2fa                 # Login with 2FA code
```

**Acceptance Criteria:**
- QR code generated correctly
- TOTP validation working (Google Authenticator compatible)
- Backup codes generated (10 codes)
- 2FA status stored in database
- Login requires 2FA if enabled

---

## 🧪 PHASE 4: TESTING & INTEGRATION (Week 5)

### Sprint 4.1: Postman Collection & API Testing

**Deliverables:**
- ✅ Complete Postman collection
- ✅ All endpoints documented
- ✅ Test scenarios

**Estimated Effort:** 4-5 hours

**Test Cases:**
```
Authentication Tests:
✓ Register new user (pending status)
✓ Login with pending user (should fail)
✓ Approve registration & assign role
✓ Login with active user (should succeed)
✓ JWT token validation
✓ Refresh token works
✓ Logout clears session

Admin Tests:
✓ List pending registrations
✓ Approve user + assign role
✓ Create custom role
✓ Assign permission to role
✓ View audit logs

User Tests:
✓ Get user profile
✓ Update profile
✓ Submit KYC Level 1
✓ Change password
✓ Enable 2FA
```

**Acceptance Criteria:**
- Postman collection with 30+ requests
- Each request has example responses
- Environment variables configured
- Tests can be automated (Postman Scripts)
- All endpoints documented with descriptions

---

### Sprint 4.2: Frontend Integration

**Deliverables:**
- ✅ Frontend API client updated
- ✅ Register page integrated
- ✅ Login workflow updated
- ✅ Admin panel endpoints updated

**Estimated Effort:** 5-6 hours

**Changes to Frontend:**
1. Update `src/lib/api.ts` to use new backend URL
2. Update `authStore.ts` to call new backend endpoints
3. Update registration flow (pending status handling)
4. Update login flow (status check)
5. Update admin pages (use new endpoints)
6. Update profile & KYC pages

**Acceptance Criteria:**
- Frontend can register new users
- Pending users see appropriate message
- Approved users can login
- Admin approval workflow works end-to-end
- All pages work with new backend

---

### Sprint 4.3: End-to-End Testing

**Deliverables:**
- ✅ Complete user journeys tested
- ✅ All roles tested
- ✅ Error handling verified

**Estimated Effort:** 3-4 hours

**Test Scenarios:**
```
Scenario 1: Individual Investor Flow
1. Register as free investor
2. Verify status = pending_approval
3. Superadmin approves with free_investor role
4. User logins successfully
5. User completes KYC Level 1
6. User can invest in projects

Scenario 2: Corporate Partnership Flow
1. Create partnership for "Shell Global"
2. Create custom role "partner_shell_global"
3. Corporate users register
4. Superadmin approves with custom role
5. Users have partnership benefits
6. API rate limits apply

Scenario 3: Admin Workflow
1. Superadmin logs in
2. Views pending registrations (3 users)
3. Approves user 1 with free_investor role
4. Rejects user 2 with reason
5. Approves user 3 with pro_investor role
6. Audit log shows all actions
```

**Acceptance Criteria:**
- All 3 scenarios work end-to-end
- No console errors
- No database errors
- Email notifications sent correctly
- Audit logs capture all actions

---

## 🚀 PHASE 5: POLISH & DEPLOYMENT (Week 6-8)

### Sprint 5.1: Performance Optimization

**Deliverables:**
- ✅ Query optimization
- ✅ Connection pooling
- ✅ Caching strategy

**Estimated Effort:** 4-5 hours

**Optimizations:**
- Add database indexes on frequently queried columns
- Implement pagination for list endpoints
- Cache role & permission data (1-hour TTL)
- Use connection pooling (already setup)
- Optimize JWT verification

---

### Sprint 5.2: Security Hardening

**Deliverables:**
- ✅ HTTPS ready
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS properly configured

**Estimated Effort:** 4-5 hours

**Security Checklist:**
- [ ] All passwords hashed with bcrypt
- [ ] JWT secrets minimum 32 characters
- [ ] Rate limiting on auth endpoints (5 attempts/15 min)
- [ ] SQL injection protection (parameterized queries)
- [ ] CORS restricted to frontend URL only
- [ ] HTTPS enforced in production
- [ ] Helmet middleware configured
- [ ] No sensitive data in logs
- [ ] Secrets in environment variables only
- [ ] Password reset tokens expire (24 hours)

---

### Sprint 5.3: Documentation & Deployment

**Deliverables:**
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Deployment guide
- ✅ Production environment setup
- ✅ Database backup strategy

**Estimated Effort:** 5-6 hours

**Documentation:**
- API endpoints with request/response examples
- Database schema documentation
- Deployment instructions (Docker, VPS)
- Troubleshooting guide
- Performance monitoring setup

---

## 📈 SUCCESS METRICS

| Metric | Target | Status |
|--------|--------|--------|
| All endpoints implemented | 100% | ⏳ |
| Code coverage | >80% | ⏳ |
| Postman tests passing | 100% | ⏳ |
| Response time <200ms | 95% | ⏳ |
| Uptime | 99.9% | ⏳ |
| Security audit passed | Yes | ⏳ |
| Documentation complete | 100% | ⏳ |
| No critical bugs | 0 | ⏳ |

---

## 🎯 DELIVERABLES BY MILESTONE

### Milestone 1: MVP Backend (End of Week 2)
- ✅ Database schema
- ✅ Authentication (register, login)
- ✅ Admin approval workflow
- ✅ Health check & basic endpoints

### Milestone 2: Full Admin (End of Week 3)
- ✅ Role management
- ✅ Partnership management
- ✅ Permission system
- ✅ Admin endpoints

### Milestone 3: Features Complete (End of Week 4)
- ✅ KYC system
- ✅ Audit logging
- ✅ Email notifications
- ✅ 2FA implementation

### Milestone 4: Testing & Integration (End of Week 5)
- ✅ Postman collection
- ✅ Frontend integration
- ✅ End-to-end tests
- ✅ Bug fixes

### Milestone 5: Production Ready (End of Week 8)
- ✅ Performance optimized
- ✅ Security hardened
- ✅ Documentation complete
- ✅ Deployment ready

---

## 👥 TEAM & RESPONSIBILITIES

**Global Fullstack Developer** (You)
- Backend API development
- Database design & optimization
- Frontend integration
- Deployment & DevOps

**Timeline**: 6-8 weeks (full-time equivalent)

---

## 🔗 DEPENDENCIES & BLOCKERS

### External Dependencies
- Gmail SMTP for email (needs app password)
- Blockchain node access (ReefChain RPC)

### Internal Dependencies
- Frontend React app (already exists)
- Supabase integration (keep running in parallel for now)

---

## 📚 REFERENCES & RESOURCES

**Documentation Written:**
- ✅ ENTERPRISE_ARCHITECTURE.md (Complete architecture)
- ✅ LOCAL_DEV_SETUP.md (Development environment)
- ✅ BACKEND_REQUIREMENTS.md (Technical specifications)
- ✅ PROJECT_IMPLEMENTATION_PLAN.md (This document)

**Code Repositories:**
- Frontend: `D:\Decarbonize`
- Backend: `D:\Decarbonize\backend` (to be created)

---

## ✅ NEXT IMMEDIATE ACTIONS

1. **TODAY**: Review & approve this plan
2. **TOMORROW**: Start Phase 1 Sprint 1.1
   - Create backend folder structure
   - Initialize npm project
   - Setup environment variables

**Estimated Time to Start Coding**: < 1 hour

---

**Document Version**: 1.0
**Last Updated**: 29 Ekim 2025
**Status**: 🟢 READY TO IMPLEMENT

---

> 💡 **Note**: This plan is detailed and achievable. Each sprint is 3-6 hours of focused development. The architecture is enterprise-grade and production-ready.
