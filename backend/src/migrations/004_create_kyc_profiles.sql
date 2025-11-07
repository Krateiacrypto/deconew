-- Create KYC profiles table
CREATE TABLE IF NOT EXISTS kyc_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,

  -- Level 1: Basic
  level_1_completed BOOLEAN DEFAULT FALSE,
  level_1_data JSON,
  level_1_submitted_at TIMESTAMP NULL,
  level_1_approved_at TIMESTAMP NULL,

  -- Level 2: Intermediate
  level_2_completed BOOLEAN DEFAULT FALSE,
  level_2_data JSON,
  level_2_submitted_at TIMESTAMP NULL,
  level_2_approved_at TIMESTAMP NULL,

  -- Level 3: Institutional
  level_3_completed BOOLEAN DEFAULT FALSE,
  level_3_data JSON,
  level_3_submitted_at TIMESTAMP NULL,
  level_3_approved_at TIMESTAMP NULL,

  -- Verification
  verification_method ENUM('online_id', 'video_call', 'document_review'),
  verified_by BIGINT,
  verification_date TIMESTAMP NULL,

  -- Status
  overall_status ENUM('pending', 'approved', 'rejected', 'under_review', 'expired')
    DEFAULT 'pending',
  rejection_reason TEXT,

  -- Expiry
  expires_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_user_id (user_id),
  INDEX idx_overall_status (overall_status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
