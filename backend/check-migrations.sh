#!/bin/bash

# ============================================
# Database Migration Check Script
# Verifies all migrations are applied correctly
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "🔍 Database Migration Check"
echo "========================================"
echo ""

# Load environment variables
if [ -f .env.local ]; then
    source .env.local
else
    echo -e "${RED}Error: .env.local not found${NC}"
    exit 1
fi

# Database connection details
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_NAME=${DB_NAME:-decarbonize_dev}
DB_USER=${DB_USER:-decarbonize}
DB_PASSWORD=${DB_PASSWORD}

# Check if mysql is available
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}Error: mysql client not found${NC}"
    exit 1
fi

# Test database connection
echo -n "Testing database connection... "
if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
    echo -e "${GREEN}✓ Connected${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    exit 1
fi

echo ""

# Check migrations directory
MIGRATIONS_DIR="./migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo -e "${RED}Error: Migrations directory not found${NC}"
    exit 1
fi

# Count migration files
MIGRATION_COUNT=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | wc -l)
echo -e "${BLUE}Found $MIGRATION_COUNT migration files${NC}"
echo ""

# Check each table exists
echo "Checking database tables..."
echo "----------------------------------------"

TABLES=(
    "users"
    "roles"
    "permissions"
    "kyc_profiles"
    "partnerships"
    "audit_logs"
    "projects"
    "pending_registrations"
    "project_documents"
    "project_endorsements"
    "project_reviews"
    "project_milestones"
    "project_updates"
    "project_faqs"
    "carbon_calculations"
    "ngo_applications"
    "ngo_verification_documents"
    "ngo_assignment_requests"
    "investments"
    "investment_returns"
    "investment_notes"
)

MISSING_TABLES=0
EXISTING_TABLES=0

for table in "${TABLES[@]}"; do
    echo -n "Checking table '$table'... "
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
        -e "DESCRIBE $table" &>/dev/null; then
        echo -e "${GREEN}✓ Exists${NC}"
        ((EXISTING_TABLES++))
    else
        echo -e "${RED}✗ Missing${NC}"
        ((MISSING_TABLES++))
    fi
done

echo ""
echo "----------------------------------------"
echo "Summary:"
echo "  Existing tables: $EXISTING_TABLES"
echo "  Missing tables: $MISSING_TABLES"
echo ""

# Check for required indexes
echo "Checking critical indexes..."
echo "----------------------------------------"

check_index() {
    local table=$1
    local index=$2
    local desc=$3

    echo -n "  $desc... "
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
        -e "SHOW INDEX FROM $table WHERE Key_name='$index'" 2>/dev/null | grep -q "$index"; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Missing${NC}"
    fi
}

check_index "projects" "idx_workflow_stage" "Projects workflow_stage index"
check_index "projects" "idx_status" "Projects status index"
check_index "investments" "idx_project_id" "Investments project_id index"
check_index "investments" "idx_investor_id" "Investments investor_id index"

echo ""

# Check for sample data
echo "Checking for sample data..."
echo "----------------------------------------"

check_data() {
    local table=$1
    local desc=$2

    COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
        -se "SELECT COUNT(*) FROM $table" 2>/dev/null)

    echo "  $desc: $COUNT records"
}

check_data "users" "Users"
check_data "projects" "Projects"
check_data "investments" "Investments"

echo ""

# Final summary
echo "========================================"
if [ $MISSING_TABLES -eq 0 ]; then
    echo -e "${GREEN}✓ All migrations applied successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tables are missing. Run migrations:${NC}"
    echo "  npm run migrate"
    exit 1
fi
