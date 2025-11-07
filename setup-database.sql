-- ============================================
-- Decarbonize Database Setup Script
-- MySQL 8.0+
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS decarbonize_dev
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS 'decarbonize'@'localhost'
IDENTIFIED BY 'Krateia1@';

-- Grant privileges
GRANT ALL PRIVILEGES ON decarbonize_dev.*
TO 'decarbonize'@'localhost';

FLUSH PRIVILEGES;

-- Verify
SELECT User, Host FROM mysql.user WHERE User = 'decarbonize';

-- Show databases
SHOW DATABASES LIKE 'decarbonize%';

-- Success message
SELECT '✅ Database setup complete!' AS Status;
SELECT 'Run migrations: cd backend && npm run migrate' AS NextStep;
