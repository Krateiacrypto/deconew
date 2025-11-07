#!/bin/bash

echo "Testing Admin Endpoints with Correct Paths"
echo "==========================================="
echo ""

# Test 1: Get pending registrations with invalid token
echo "[TEST 1] GET /api/auth/admin/registrations/pending - Invalid Token"
curl -s -X GET "http://localhost:3002/api/auth/admin/registrations/pending" \
  -H "Authorization: Bearer invalid_token_here" | jq '.' 2>/dev/null || echo "Testing endpoint..."
echo ""

# Test 2: Try to approve registration with invalid token
echo "[TEST 2] POST /api/auth/admin/registrations/2/approve - Invalid Token"
curl -s -X POST "http://localhost:3002/api/auth/admin/registrations/2/approve" \
  -H "Authorization: Bearer invalid_token_here" \
  -H "Content-Type: application/json" \
  -d '{"role_id":4}' | jq '.' 2>/dev/null || echo "Testing endpoint..."
echo ""

# Test 3: Try to reject registration with invalid token
echo "[TEST 3] POST /api/auth/admin/registrations/2/reject - Invalid Token"
curl -s -X POST "http://localhost:3002/api/auth/admin/registrations/2/reject" \
  -H "Authorization: Bearer invalid_token_here" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Test rejection"}' | jq '.' 2>/dev/null || echo "Testing endpoint..."
echo ""

echo "==========================================="
echo "Admin endpoint tests completed"
