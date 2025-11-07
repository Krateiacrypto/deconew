-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_code VARCHAR(50) UNIQUE NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Role Hierarchy
  parent_role_id BIGINT,
  role_tier ENUM('system', 'institutional', 'professional', 'retail')
    DEFAULT 'retail',

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Permissions (JSON for flexibility)
  permissions JSON,

  -- Restrictions (Enterprise)
  restrictions JSON,

  -- Metadata
  metadata JSON,

  -- System role flag
  is_system_role BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,

  -- Indexes
  INDEX idx_role_code (role_code),
  INDEX idx_parent_role_id (parent_role_id),
  INDEX idx_role_tier (role_tier),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert system roles
INSERT INTO roles (role_code, role_name, description, role_tier, is_system_role, is_active)
VALUES
  ('superadmin', 'Super Administrator', 'Full system access', 'system', TRUE, TRUE),
  ('admin', 'Administrator', 'Platform administration', 'system', TRUE, TRUE),
  ('institutional_investor', 'Institutional Investor', 'Institutional-level investor', 'institutional', TRUE, TRUE),
  ('pro_investor', 'Professional Investor', 'Professional trader', 'professional', TRUE, TRUE),
  ('free_investor', 'Free Investor', 'Basic investor tier', 'retail', TRUE, TRUE),
  ('carbon_provider', 'Carbon Provider', 'Carbon credit provider', 'institutional', TRUE, TRUE),
  ('verifier', 'Project Verifier', 'Project verification', 'professional', TRUE, TRUE),
  ('advisor', 'Investment Advisor', 'Investment advisory', 'professional', TRUE, TRUE),
  ('ngo', 'NGO', 'Environmental NGO', 'institutional', TRUE, TRUE),
  ('web_admin', 'Web Administrator', 'Content management', 'system', TRUE, TRUE),
  ('user', 'User', 'Default user', 'retail', TRUE, TRUE)
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);
