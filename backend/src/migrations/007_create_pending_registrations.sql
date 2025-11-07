-- Create pending registrations table
CREATE TABLE IF NOT EXISTS pending_registrations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Request Info
  requested_role VARCHAR(50),
  organization_name VARCHAR(255),
  organization_type ENUM('individual', 'company', 'ngo', 'financial_institution'),

  -- Contact
  phone VARCHAR(20),
  country VARCHAR(100),

  -- Additional Info
  purpose_of_use TEXT,
  how_heard_about_us VARCHAR(100),
  additional_data JSON,

  -- Email Verification
  email_token VARCHAR(255) UNIQUE,
  email_token_expires_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,

  -- Admin Review
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by BIGINT,

  -- Decision
  status ENUM('pending', 'approved', 'rejected', 'requires_more_info')
    DEFAULT 'pending',
  approval_notes TEXT,
  rejection_reason TEXT,

  -- If approved, link to actual user
  user_id BIGINT,

  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
