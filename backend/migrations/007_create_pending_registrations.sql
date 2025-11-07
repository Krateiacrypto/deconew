-- Create pending registrations table
CREATE TABLE IF NOT EXISTS pending_registrations (
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

  -- Registration status
  status ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',

  -- Review info
  reviewed_by INT,
  review_notes TEXT,
  reviewed_at TIMESTAMP NULL,

  -- Rejection info
  rejection_reason TEXT,
  rejected_at TIMESTAMP NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,

  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
