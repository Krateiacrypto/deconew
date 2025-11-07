-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  country VARCHAR(100),
  organization_name VARCHAR(255),
  organization_type VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',

  -- Status fields
  status ENUM('pending_approval', 'email_verified', 'under_review', 'active', 'suspended', 'inactive') DEFAULT 'pending_approval',

  -- KYC fields
  kyc_level ENUM('level_0', 'level_1', 'level_2', 'level_3') DEFAULT 'level_0',
  kyc_status ENUM('not_started', 'pending', 'approved', 'rejected') DEFAULT 'not_started',

  -- User type
  user_type ENUM('individual', 'institutional', 'advisor', 'verifier', 'partner') DEFAULT 'individual',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,

  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
