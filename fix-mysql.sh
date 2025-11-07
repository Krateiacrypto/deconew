#!/bin/bash
# ============================================
# MySQL Setup & Verification Script
# ============================================

echo "🔧 MySQL Database Setup & Fix"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL not found!${NC}"
    echo ""
    echo "Install MySQL:"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "  CentOS/RHEL:   sudo yum install mysql-server"
    echo "  Mac:           brew install mysql"
    exit 1
fi

echo -e "${GREEN}✅ MySQL found${NC}"
echo ""

# Check MySQL service status
echo "📊 Checking MySQL service..."
if sudo systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✅ MySQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL is not running. Starting...${NC}"
    sudo systemctl start mysql
    sleep 2
    if sudo systemctl is-active --quiet mysql; then
        echo -e "${GREEN}✅ MySQL started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MySQL${NC}"
        echo "Try manually: sudo systemctl start mysql"
        exit 1
    fi
fi

echo ""
echo "🔐 Setting up database and user..."
echo "Please enter MySQL root password:"

# Create database setup SQL
cat > /tmp/decarbonize_setup.sql <<'EOF'
-- Create database
CREATE DATABASE IF NOT EXISTS decarbonize_dev
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'decarbonize'@'localhost'
IDENTIFIED BY 'Krateia1@';

-- Grant all privileges
GRANT ALL PRIVILEGES ON decarbonize_dev.*
TO 'decarbonize'@'localhost';

FLUSH PRIVILEGES;

-- Verify
SELECT 'Database created successfully!' AS Status;
SELECT User, Host FROM mysql.user WHERE User = 'decarbonize';
EOF

# Run setup
mysql -u root -p < /tmp/decarbonize_setup.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database setup complete${NC}"
    rm /tmp/decarbonize_setup.sql
else
    echo -e "${RED}❌ Database setup failed${NC}"
    exit 1
fi

echo ""
echo "🧪 Testing connection..."

# Test connection
if mysql -u decarbonize -pKrateia1@ -e "USE decarbonize_dev; SELECT 'Connection successful!' AS Status;" 2>/dev/null; then
    echo -e "${GREEN}✅ Connection test passed${NC}"
else
    echo -e "${RED}❌ Connection test failed${NC}"
    echo "Check credentials in backend/.env.local"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 MySQL Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Run migrations: cd backend && npm run migrate"
echo "  2. Seed data: cd backend && npm run seed"
echo "  3. Start backend: cd backend && npm start"
echo ""
