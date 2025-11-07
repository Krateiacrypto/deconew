-- Decarbonize MySQL Setup Script
-- This script creates the database and user for local development
-- Run this with: mysql -u root -p < setup-db.sql

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS decarbonize_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';

-- Grant privileges
GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
FLUSH PRIVILEGES;

-- Verify setup
SELECT 'Database and user created successfully!' as Status;
