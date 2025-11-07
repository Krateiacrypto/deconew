-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  permission_code VARCHAR(100) UNIQUE NOT NULL,
  permission_name VARCHAR(150),
  category ENUM(
    'user_management',
    'project_management',
    'financial',
    'analytics',
    'smart_contract',
    'content_management',
    'compliance',
    'partnership'
  ) DEFAULT 'user_management',
  description TEXT,
  is_system_permission BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_category (category),
  INDEX idx_permission_code (permission_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default permissions
INSERT INTO permissions (permission_code, permission_name, category, is_system_permission)
VALUES
  -- User Management
  ('user:create', 'Create User', 'user_management', TRUE),
  ('user:read', 'Read User', 'user_management', TRUE),
  ('user:update', 'Update User', 'user_management', TRUE),
  ('user:delete', 'Delete User', 'user_management', TRUE),
  ('user:suspend', 'Suspend User', 'user_management', TRUE),
  ('user:approve', 'Approve User Registration', 'user_management', TRUE),

  -- Project Management
  ('project:create', 'Create Project', 'project_management', TRUE),
  ('project:read', 'Read Project', 'project_management', TRUE),
  ('project:update', 'Update Project', 'project_management', TRUE),
  ('project:approve', 'Approve Project', 'project_management', TRUE),
  ('project:reject', 'Reject Project', 'project_management', TRUE),

  -- Financial
  ('invest:create', 'Create Investment', 'financial', TRUE),
  ('invest:view', 'View Investments', 'financial', TRUE),
  ('invest:unlimited', 'Unlimited Investment', 'financial', TRUE),
  ('trading:basic', 'Basic Trading', 'financial', TRUE),
  ('trading:advanced', 'Advanced Trading', 'financial', TRUE),
  ('staking:participate', 'Participate in Staking', 'financial', TRUE),

  -- Analytics
  ('analytics:view', 'View Analytics', 'analytics', TRUE),
  ('analytics:custom', 'Custom Analytics', 'analytics', TRUE),
  ('reporting:generate', 'Generate Reports', 'analytics', TRUE),

  -- Compliance
  ('kyc:review', 'Review KYC', 'compliance', TRUE),
  ('kyc:approve', 'Approve KYC', 'compliance', TRUE),
  ('audit:view', 'View Audit Logs', 'compliance', TRUE),
  ('compliance:manage', 'Manage Compliance', 'compliance', TRUE),

  -- Smart Contract
  ('contract:deploy', 'Deploy Smart Contract', 'smart_contract', TRUE),
  ('contract:execute', 'Execute Smart Contract', 'smart_contract', TRUE),

  -- Content Management
  ('content:create', 'Create Content', 'content_management', TRUE),
  ('content:edit', 'Edit Content', 'content_management', TRUE),
  ('content:publish', 'Publish Content', 'content_management', TRUE),
  ('blog:manage', 'Manage Blog', 'content_management', TRUE),

  -- Partnership
  ('partnership:create', 'Create Partnership', 'partnership', TRUE),
  ('partnership:manage', 'Manage Partnership', 'partnership', TRUE),
  ('partnership:api', 'Partnership API Access', 'partnership', TRUE)
ON DUPLICATE KEY UPDATE permission_name = VALUES(permission_name);
