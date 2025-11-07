-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id INT,

  -- Details
  changes JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Status
  status ENUM('success', 'failure', 'warning') DEFAULT 'success',
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

  -- Indexes (important for compliance queries)
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_resource_type (resource_type),
  INDEX idx_created_at (created_at),
  INDEX idx_user_action (user_id, action, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
