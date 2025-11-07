-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id BIGINT,

  old_values JSON,
  new_values JSON,

  ip_address VARCHAR(45),
  user_agent TEXT,

  status ENUM('success', 'failed', 'partial') DEFAULT 'success',
  error_message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at),
  INDEX idx_resource_type (resource_type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
