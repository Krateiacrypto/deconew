-- Create KYC profiles table
CREATE TABLE IF NOT EXISTS kyc_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  kyc_level ENUM('level_0', 'level_1', 'level_2', 'level_3') DEFAULT 'level_0',
  status ENUM('not_started', 'pending', 'approved', 'rejected') DEFAULT 'not_started',

  -- Level 1: Basic identity
  id_document_type VARCHAR(50),
  id_document_number VARCHAR(100),
  date_of_birth DATE,
  nationality VARCHAR(100),

  -- Level 2: Advanced verification
  proof_of_address VARCHAR(255),
  tax_id VARCHAR(100),
  business_registration VARCHAR(255),

  -- Level 3: Institutional
  annual_revenue DECIMAL(15, 2),
  employees_count INT,
  office_address TEXT,
  business_license VARCHAR(255),

  -- Review info
  reviewed_by INT,
  review_notes TEXT,
  reviewed_at TIMESTAMP NULL,

  -- Rejection info
  rejection_reason TEXT,
  rejected_at TIMESTAMP NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,

  -- Indexes
  INDEX idx_user_id (user_id),
  INDEX idx_kyc_level (kyc_level),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
