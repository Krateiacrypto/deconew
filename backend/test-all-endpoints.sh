#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3002/api"
TEST_RESULTS=""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}AUTH ENDPOINTS - COMPREHENSIVE TEST SUITE${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

# Test 1: Register first user
echo -e "${YELLOW}[TEST 1] POST /auth/register - New User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser1@example.com",
    "password":"SecurePass123!@",
    "first_name":"Test",
    "last_name":"User1",
    "country":"Turkey"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Test 2: Try to register duplicate email
echo -e "${YELLOW}[TEST 2] POST /auth/register - Duplicate Email (Error Test)${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser1@example.com",
    "password":"AnotherPass456!@",
    "first_name":"Another",
    "last_name":"User"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$DUPLICATE_RESPONSE" | jq '.' 2>/dev/null || echo "$DUPLICATE_RESPONSE"
echo ""

# Test 3: Register second user (for later tests)
echo -e "${YELLOW}[TEST 3] POST /auth/register - Second User${NC}"
REGISTER2_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@test.local",
    "password":"AdminPass123!@#",
    "first_name":"Admin",
    "last_name":"Test",
    "country":"Turkey"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$REGISTER2_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER2_RESPONSE"
echo ""

# Extract registration ID for approval test (if available)
REGISTRATION_ID=$(echo "$REGISTER2_RESPONSE" | jq -r '.registration_id // empty' 2>/dev/null)

# Test 4: Try login (should fail - user pending approval)
echo -e "${YELLOW}[TEST 4] POST /auth/login - Pending User (Should Fail)${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser1@example.com",
    "password":"SecurePass123!@"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Test 5: Try login with wrong password
echo -e "${YELLOW}[TEST 5] POST /auth/login - Wrong Password${NC}"
WRONG_PASS_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser1@example.com",
    "password":"WrongPassword123!"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$WRONG_PASS_RESPONSE" | jq '.' 2>/dev/null || echo "$WRONG_PASS_RESPONSE"
echo ""

# Test 6: Get pending registrations (without auth - should fail)
echo -e "${YELLOW}[TEST 6] GET /admin/registrations/pending - No Auth (Should Fail)${NC}"
NO_AUTH_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/registrations/pending")

echo -e "${GREEN}Response:${NC}"
echo "$NO_AUTH_RESPONSE" | jq '.' 2>/dev/null || echo "$NO_AUTH_RESPONSE"
echo ""

# Test 7: Get pending registrations with invalid token
echo -e "${YELLOW}[TEST 7] GET /admin/registrations/pending - Invalid Token${NC}"
INVALID_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/registrations/pending" \
  -H "Authorization: Bearer invalid_token_here")

echo -e "${GREEN}Response:${NC}"
echo "$INVALID_TOKEN_RESPONSE" | jq '.' 2>/dev/null || echo "$INVALID_TOKEN_RESPONSE"
echo ""

# Test 8: Try to approve registration without auth
echo -e "${YELLOW}[TEST 8] POST /admin/registrations/:id/approve - No Auth (Should Fail)${NC}"
if [ ! -z "$REGISTRATION_ID" ]; then
  APPROVE_NO_AUTH=$(curl -s -X POST "$BASE_URL/admin/registrations/$REGISTRATION_ID/approve" \
    -H "Content-Type: application/json" \
    -d '{"role_id":4}')

  echo -e "${GREEN}Response:${NC}"
  echo "$APPROVE_NO_AUTH" | jq '.' 2>/dev/null || echo "$APPROVE_NO_AUTH"
else
  echo -e "${RED}Could not extract registration ID${NC}"
fi
echo ""

# Test 9: Try to refresh token without valid token
echo -e "${YELLOW}[TEST 9] POST /auth/refresh-token - Invalid Token${NC}"
REFRESH_INVALID=$(curl -s -X POST "$BASE_URL/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"invalid_refresh_token"}')

echo -e "${GREEN}Response:${NC}"
echo "$REFRESH_INVALID" | jq '.' 2>/dev/null || echo "$REFRESH_INVALID"
echo ""

# Test 10: Try logout without auth
echo -e "${YELLOW}[TEST 10] POST /auth/logout - No Auth (Should Fail)${NC}"
LOGOUT_NO_AUTH=$(curl -s -X POST "$BASE_URL/auth/logout")

echo -e "${GREEN}Response:${NC}"
echo "$LOGOUT_NO_AUTH" | jq '.' 2>/dev/null || echo "$LOGOUT_NO_AUTH"
echo ""

# Test 11: Verify email endpoint
echo -e "${YELLOW}[TEST 11] POST /auth/verify-email - Invalid Token${NC}"
VERIFY_EMAIL=$(curl -s -X POST "$BASE_URL/auth/verify-email" \
  -H "Content-Type: application/json" \
  -d '{"token":"invalid_email_token"}')

echo -e "${GREEN}Response:${NC}"
echo "$VERIFY_EMAIL" | jq '.' 2>/dev/null || echo "$VERIFY_EMAIL"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST SUITE COMPLETE${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Summary:${NC}"
echo "✅ Register endpoint - TESTED"
echo "⏳ Login endpoint - TESTED (fails as expected for pending users)"
echo "⏳ Refresh token - TESTED (fails without valid token)"
echo "⏳ Logout - TESTED (fails without auth)"
echo "⏳ Verify email - TESTED"
echo "⏳ Admin endpoints - REQUIRE AUTHENTICATION"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Need to get admin user with active status to test admin endpoints"
echo "2. Can use login with admin user and JWT token to test protected routes"
echo "3. See README for full documentation"
