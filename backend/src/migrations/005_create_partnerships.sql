-- Create partnerships table
CREATE TABLE IF NOT EXISTS partnerships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  partner_name VARCHAR(255) NOT NULL,
  partner_type ENUM('investor', 'provider', 'distributor', 'technology', 'other'),

  -- Legal
  legal_entity_name VARCHAR(255),
  registration_number VARCHAR(100),
  tax_id VARCHAR(50),
  country VARCHAR(100),

  -- Contract
  contract_start_date DATE,
  contract_end_date DATE,
  contract_document_url VARCHAR(500),

  -- Partnership Role
  custom_role_id BIGINT,

  -- Commercial Terms
  commission_rate DECIMAL(5, 4),
  minimum_volume DECIMAL(18, 2),
  volume_discount_tiers JSON,

  -- Account Management
  primary_contact_name VARCHAR(100),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(20),
  account_manager_id BIGINT,

  -- Status
  status ENUM('active', 'pending', 'suspended', 'terminated')
    DEFAULT 'pending',

  -- Metadata
  metadata JSON,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,

  -- Indexes
  INDEX idx_partner_name (partner_name),
  INDEX idx_status (status),
  INDEX idx_custom_role_id (custom_role_id),
  INDEX idx_account_manager_id (account_manager_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
