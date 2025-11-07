#!/bin/bash

echo "Testing auth/register endpoint..."
curl -s -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePassword123!","first_name":"Test","last_name":"User","country":"Turkey"}' | head -50
