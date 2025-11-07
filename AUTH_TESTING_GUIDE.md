# 🔐 Authentication Endpoints - Testing Guide

**Phase 2.3: Authentication Implementation COMPLETE**
**Status**: Ready for Testing
**Date**: 30 Ekim 2025

---

## ✅ COMPLETED

### Files Created

**Auth Types** (`src/types/auth.ts`):
- Request/Response interfaces
- JWT payload types
- Error codes
- Database models

**Auth Service** (`src/services/authService.ts`):
- Password hashing (bcryptjs)
- JWT token generation & verification
- User registration
- Login authentication
- Token refresh
- Admin operations
- Database queries

**Auth Middleware** (`src/middleware/authenticate.ts`):
- JWT verification
- Token attachment to request
- Role-based access control
- Optional authentication

**Auth Controller** (`src/controllers/authController.ts`):
- Request handlers
- Input validation
- Error handling
- Response formatting

**Auth Routes** (`src/routes/auth.ts`):
- All 8 endpoints defined
- Protected routes
- Admin routes

**Integration** (`src/index.ts`):
- Routes mounted at `/api/auth`

---

## 🧪 HOW TO TEST

### Step 1: Start Backend

```bash
cd D:\Decarbonize\backend
npm run build
node dist/index.js
```

Server starts on `http://localhost:3001`

### Step 2: Test Endpoints

Open a new terminal and run the curl commands below.

---

## 📝 API ENDPOINTS & TEST COMMANDS

### 1️⃣ REGISTER - Create Pending User

**Endpoint**: `POST /api/auth/register`
**Status**: Public (no auth required)
**Description**: Register a new user (awaiting admin approval)

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "organization_name": "Tech Company",
    "organization_type": "company",
    "phone": "+90 555 123 4567",
    "country": "Turkey",
    "language": "tr"
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration submitted successfully. Awaiting admin approval.",
  "user": {
    "id": 0,
    "email": "john@example.com",
    "status": "pending_approval"
  },
  "registration_id": 1
}
```

**Note**: User status is `pending_approval`, cannot login yet!

---

### 2️⃣ GET PENDING REGISTRATIONS - Admin View

**Endpoint**: `GET /api/admin/registrations/pending`
**Status**: Protected (requires JWT token)
**Description**: List all pending registrations

```bash
# First, you need a token from admin user
# For now, we'll skip this as no user is active yet
# After creating admin, use:

curl -X GET "http://localhost:3001/api/admin/registrations/pending?limit=50&offset=0" \
  -H "Authorization: Bearer <admin_token>"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "total": 1,
  "pending": [
    {
      "id": 1,
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "organization_name": "Tech Company",
      "organization_type": "company",
      "phone": "+90 555 123 4567",
      "country": "Turkey",
      "status": "submitted",
      "created_at": "2025-10-30T00:45:00.000Z",
      "submitted_at": "2025-10-30T00:45:00.000Z"
    }
  ]
}
```

---

### 3️⃣ APPROVE REGISTRATION - Admin Action

**Endpoint**: `POST /api/admin/registrations/:id/approve`
**Status**: Protected (requires JWT token)
**Description**: Approve registration and create user account

```bash
curl -X POST http://localhost:3001/api/admin/registrations/1/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "role_id": 2,
    "notes": "Approved"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Registration approved successfully",
  "registration_id": 1,
  "action": "approved"
}
```

**Result**: User status changes to `active`, password hash transferred from pending_registrations to users table

---

### 4️⃣ REJECT REGISTRATION - Admin Action

**Endpoint**: `POST /api/admin/registrations/:id/reject`
**Status**: Protected (requires JWT token)
**Description**: Reject registration

```bash
curl -X POST http://localhost:3001/api/admin/registrations/1/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "reason": "Incomplete information"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Registration rejected successfully",
  "registration_id": 1,
  "action": "rejected"
}
```

---

### 5️⃣ LOGIN - Authenticate User

**Endpoint**: `POST /api/auth/login`
**Status**: Public (no auth required)
**Description**: Login with email & password, get JWT tokens

**Prerequisites**: User must be `active` status (approved registration)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active",
    "kyc_level": "level_1",
    "kyc_status": "pending",
    "organization_name": "Tech Company",
    "country": "Turkey",
    "language": "tr",
    "created_at": "2025-10-30T00:46:00.000Z",
    "updated_at": "2025-10-30T00:46:00.000Z"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

**Store these tokens!** You'll need `access_token` for protected endpoints.

---

### 6️⃣ GET ME - Get Current User

**Endpoint**: `GET /api/auth/me`
**Status**: Protected (requires JWT token)
**Description**: Get authenticated user's information

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <access_token_from_login>"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active",
    "kyc_level": "level_1",
    "kyc_status": "pending",
    "organization_name": "Tech Company",
    "country": "Turkey",
    "language": "tr",
    "created_at": "2025-10-30T00:46:00.000Z",
    "updated_at": "2025-10-30T00:46:00.000Z"
  }
}
```

---

### 7️⃣ REFRESH TOKEN - Get New Access Token

**Endpoint**: `POST /api/auth/refresh-token`
**Status**: Public (no auth required)
**Description**: Use refresh token to get new access token

```bash
curl -X POST http://localhost:3001/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "<refresh_token_from_login>"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

**Use Case**: Access token expired but refresh token still valid? Use this to get new access token.

---

### 8️⃣ LOGOUT - End Session

**Endpoint**: `POST /api/auth/logout`
**Status**: Protected (requires JWT token)
**Description**: Logout user (client-side token removal)

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Note**: JWT is stateless, so logout is just a client-side operation. In future, we can implement token blacklisting.

---

## 🔄 COMPLETE FLOW - Step by Step

### Flow 1: Register → Approve → Login

**Terminal 1**: Start Backend
```bash
cd D:\Decarbonize\backend
npm run build
node dist/index.js
```

**Terminal 2**: Test Flow

```bash
# Step 1: User registers
REGISTRATION=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AlicePass123!",
    "first_name": "Alice",
    "last_name": "Smith",
    "country": "UK"
  }')

echo "Registration Response:"
echo $REGISTRATION | jq .
REGISTRATION_ID=$(echo $REGISTRATION | jq -r '.registration_id')
echo "Registration ID: $REGISTRATION_ID"

# Step 2: Try to login (should fail - not approved yet)
echo -e "\n❌ Trying to login before approval (should fail):"
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AlicePass123!"
  }' | jq .

# Step 3: Admin approves (need admin token - for now assume we have it)
# Note: In production, first user should be created manually in DB
echo -e "\n✅ Admin approves registration:"
curl -s -X POST http://localhost:3001/api/admin/registrations/$REGISTRATION_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"role_id": 2}' | jq .

# Step 4: Now login works
echo -e "\n✅ Login after approval:"
LOGIN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AlicePass123!"
  }')

echo $LOGIN | jq .
ACCESS_TOKEN=$(echo $LOGIN | jq -r '.tokens.access_token')
echo "Access Token: $ACCESS_TOKEN"

# Step 5: Get user info with token
echo -e "\n✅ Get user info:"
curl -s -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Step 6: Logout
echo -e "\n✅ Logout:"
curl -s -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

---

## ✅ ERROR SCENARIOS

### Test Error Cases

**Invalid Email**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "Pass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
# Expected: 400 Bad Request - "Invalid email format"
```

**Weak Password**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "weak",
    "first_name": "Test",
    "last_name": "User"
  }'
# Expected: 400 Bad Request - "Password must be at least 8 characters"
```

**Email Already Exists**:
```bash
# Register twice with same email
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "Pass123456!",
    "first_name": "Test",
    "last_name": "User"
  }'

# Second time:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "Pass123456!",
    "first_name": "Test",
    "last_name": "User"
  }'
# Expected: 409 Conflict - "Email already registered"
```

**Invalid Credentials**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "WrongPassword!"
  }'
# Expected: 401 Unauthorized - "Invalid email or password"
```

**Missing Token**:
```bash
curl -X GET http://localhost:3001/api/auth/me
# Expected: 401 Unauthorized - "No token provided"
```

**Invalid Token**:
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
# Expected: 403 Forbidden - "Invalid or expired token"
```

---

## 📊 DATABASE CHECK

After testing, verify data in database:

```bash
mysql -u decarbonize -p decarbonize_dev
# Password: Dev123!@#

# Check pending registrations
SELECT id, email, status FROM pending_registrations;

# Check active users
SELECT id, email, status FROM users WHERE status='active';

# Check JWT tokens (none stored - stateless, but verify data)
SELECT id, email, last_login FROM users;

EXIT;
```

---

## 🎯 SUCCESS CRITERIA

All tests pass when:

- ✅ Register endpoint creates pending_registrations
- ✅ Approve endpoint creates users account
- ✅ Reject endpoint marks registration rejected
- ✅ Login works only for active users
- ✅ JWT tokens are generated correctly
- ✅ Protected endpoints require valid token
- ✅ Invalid tokens are rejected
- ✅ Refresh token works
- ✅ Error messages are clear
- ✅ Status codes are correct

---

## 📝 NEXT STEPS

1. **Test all endpoints** using curl commands above
2. **Verify database** entries
3. **Test error scenarios** to ensure proper error handling
4. **Check JWT tokens** in jwt.io
5. **Create Postman collection** for easier testing
6. **Implement frontend** login form
7. **Phase 2.2**: Security improvements
8. **Phase 3**: Advanced features

---

**Status**: ✅ Authentication System Ready for Testing!

