-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  type ENUM('system', 'partnership') DEFAULT 'system',

  -- Permission levels
  permission_level INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_name (name),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default system roles
INSERT IGNORE INTO roles (id, name, description, type, permission_level) VALUES
(1, 'super_admin', 'Full system access', 'system', 1000),
(2, 'admin', 'Administrator access', 'system', 500),
(3, 'moderator', 'Moderation access', 'system', 300),
(4, 'investor', 'Investor user', 'system', 100),
(5, 'carbon_provider', 'Carbon credit provider', 'system', 100),
(6, 'advisor', 'Financial advisor', 'system', 100),
(7, 'verifier', 'KYC verifier', 'system', 200),
(8, 'ngo', 'NGO member', 'system', 50),
(9, 'analyst', 'Data analyst', 'system', 150),
(10, 'support', 'Support staff', 'system', 150),
(11, 'user', 'Regular user', 'system', 10);
