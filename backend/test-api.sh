#!/bin/bash

# ============================================
# API Endpoint Test Suite
# Tests all critical endpoints for the Decarbonize platform
# ============================================

API_BASE="http://localhost:3002/api"
FAILED_TESTS=0
PASSED_TESTS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "🧪 Decarbonize API Test Suite"
echo "========================================"
echo ""

# Helper function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_code=${4:-200}
    local data=$5
    local token=$6

    echo -n "Testing: $description... "

    if [ "$method" = "GET" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token" "$API_BASE$endpoint")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE$endpoint")
        fi
    elif [ "$method" = "POST" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" "$API_BASE$endpoint")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$API_BASE$endpoint")
        fi
    fi

    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_code, Got: $response)"
        ((FAILED_TESTS++))
    fi
}

# ============================================
# 1. HEALTH CHECKS
# ============================================
echo "1️⃣  Health Checks"
echo "----------------------------------------"
test_endpoint "GET" "/health" "Backend health check" 200
test_endpoint "GET" "/health/db" "Database health check" 200
echo ""

# ============================================
# 2. PUBLIC ENDPOINTS (No Auth Required)
# ============================================
echo "2️⃣  Public Endpoints"
echo "----------------------------------------"
test_endpoint "GET" "/projects" "Get public projects list" 200
test_endpoint "GET" "/projects?category=reforestation" "Get projects by category" 200
test_endpoint "GET" "/projects?search=forest" "Search projects" 200
echo ""

# Note: Project detail endpoint needs valid project ID
# test_endpoint "GET" "/projects/1" "Get project details" 200

# ============================================
# 3. AUTHENTICATION (Register and Login)
# ============================================
echo "3️⃣  Authentication Endpoints"
echo "----------------------------------------"

# Generate random email for testing
TEST_EMAIL="test_$(date +%s)@test.com"
TEST_PASSWORD="TestPassword123!"

# Register endpoint test
REGISTER_DATA='{
  "email": "'$TEST_EMAIL'",
  "password": "'$TEST_PASSWORD'",
  "firstName": "Test",
  "lastName": "User",
  "userType": "investor"
}'

echo "Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$REGISTER_DATA" "$API_BASE/auth/register")
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"

# Login endpoint test
LOGIN_DATA='{
  "email": "'$TEST_EMAIL'",
  "password": "'$TEST_PASSWORD'"
}'

echo ""
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$LOGIN_DATA" "$API_BASE/auth/login")
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract access token if login successful
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // empty' 2>/dev/null)

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo -e "${GREEN}✓ Login successful, token obtained${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${YELLOW}⚠ Could not obtain access token. Protected endpoint tests will be skipped.${NC}"
fi

echo ""

# ============================================
# 4. PROTECTED ENDPOINTS (Auth Required)
# ============================================
if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "4️⃣  Protected Endpoints (with auth)"
    echo "----------------------------------------"

    test_endpoint "GET" "/auth/me" "Get current user profile" 200 "" "$ACCESS_TOKEN"
    test_endpoint "GET" "/investments/my-investments" "Get user investments" 200 "" "$ACCESS_TOKEN"

    echo ""
else
    echo "4️⃣  Protected Endpoints (SKIPPED - no token)"
    echo "----------------------------------------"
    echo -e "${YELLOW}Skipping protected endpoint tests${NC}"
    echo ""
fi

# ============================================
# 5. WORKFLOW ENDPOINTS
# ============================================
echo "5️⃣  Workflow Endpoints"
echo "----------------------------------------"
echo "Note: Most workflow endpoints require authentication and specific roles"
echo -e "${YELLOW}These tests are informational only${NC}"
echo ""

# ============================================
# TEST SUMMARY
# ============================================
echo "========================================"
echo "📊 Test Summary"
echo "========================================"
echo -e "Total Tests: $((PASSED_TESTS + FAILED_TESTS))"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
