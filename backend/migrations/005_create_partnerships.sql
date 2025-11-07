-- Create partnerships table
CREATE TABLE IF NOT EXISTS partnerships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Partnership type
  type ENUM('b2b', 'b2c', 'affiliate', 'reseller', 'integrator') DEFAULT 'b2b',

  -- Entities
  owner_id INT NOT NULL,
  partner_company_name VARCHAR(255),
  partner_website VARCHAR(255),
  partner_email VARCHAR(255),

  -- Status
  status ENUM('pending', 'active', 'suspended', 'terminated') DEFAULT 'pending',

  -- Financial terms
  commission_rate DECIMAL(5, 2),
  min_monthly_volume DECIMAL(15, 2),
  payment_terms VARCHAR(50),

  -- Custom role for partnership
  custom_role_id INT,

  -- Contract
  contract_url VARCHAR(255),
  contract_start_date DATE,
  contract_end_date DATE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (custom_role_id) REFERENCES roles(id) ON DELETE SET NULL,

  -- Indexes
  INDEX idx_owner_id (owner_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Partnership members junction table
CREATE TABLE IF NOT EXISTS partnership_members (
  partnership_id INT NOT NULL,
  user_id INT NOT NULL,
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (partnership_id, user_id),
  FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,

  -- Indexes
  INDEX idx_partnership_id (partnership_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
