-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Status workflow
  status ENUM(
    'pending_approval',
    'email_verified',
    'under_review',
    'active',
    'suspended',
    'rejected',
    'archived'
  ) DEFAULT 'pending_approval',

  -- Role assignment (by superadmin)
  role_id BIGINT,
  assigned_at TIMESTAMP NULL,
  assigned_by BIGINT,

  -- KYC & Compliance
  kyc_level ENUM('level_1', 'level_2', 'level_3') DEFAULT 'level_1',
  kyc_status ENUM('pending', 'approved', 'rejected', 'expired', 'under_review')
    DEFAULT 'pending',
  kyc_verified_at TIMESTAMP NULL,
  kyc_verified_by BIGINT,
  kyc_expires_at TIMESTAMP NULL,

  -- Investor Tier (if applicable)
  investor_tier ENUM('free', 'pro', 'institutional') NULL,
  minimum_investment DECIMAL(18, 2) NULL,
  monthly_limit DECIMAL(18, 2) NULL,
  trading_fee_rate DECIMAL(5, 4) NULL,
  staking_multiplier DECIMAL(3, 2) NULL,
  tier_upgraded_at TIMESTAMP NULL,

  -- Contact Information
  phone VARCHAR(20),
  country VARCHAR(100),
  language ENUM('tr', 'en', 'de', 'fr') DEFAULT 'tr',

  -- Organization Details
  organization_name VARCHAR(255),
  organization_type ENUM('individual', 'company', 'ngo', 'financial_institution'),
  tax_id VARCHAR(50),

  -- Blockchain
  wallet_address VARCHAR(255) UNIQUE,

  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP NULL,

  -- Partnership Information
  partnership_id BIGINT,
  partner_manager_id BIGINT,

  -- Administrative
  is_active BOOLEAN DEFAULT TRUE,
  admin_notes TEXT,
  rejection_reason TEXT,
  rejection_date TIMESTAMP NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  last_activity TIMESTAMP NULL,

  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_role_id (role_id),
  INDEX idx_organization (organization_name),
  INDEX idx_created_at (created_at),
  INDEX idx_partnership_id (partnership_id),
  INDEX idx_kyc_status (kyc_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints (after roles table is created)
-- ALTER TABLE users ADD CONSTRAINT fk_users_role_id
--   FOREIGN KEY (role_id) REFERENCES roles(id);
