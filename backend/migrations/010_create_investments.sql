-- ============================================
-- Investment System
-- Track user investments in projects
-- ============================================

CREATE TABLE IF NOT EXISTS investments (
  id INT PRIMARY KEY AUTO_INCREMENT,

  -- References
  project_id INT NOT NULL,
  investor_id INT NOT NULL,

  -- Investment Details
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD' NOT NULL,

  -- Fees
  platform_fee DECIMAL(15, 2) DEFAULT 0,
  transaction_fee DECIMAL(15, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2) NOT NULL,

  -- Tokens
  tokens_received DECIMAL(20, 8) NOT NULL,
  token_symbol VARCHAR(20) DEFAULT 'CO2',
  token_price DECIMAL(15, 4) NOT NULL,

  -- Carbon Credits
  carbon_credits DECIMAL(15, 4) DEFAULT 0,

  -- Expected Returns (calculated at time of investment)
  estimated_monthly_return DECIMAL(15, 2),
  estimated_yearly_return DECIMAL(15, 2),
  estimated_total_return DECIMAL(15, 2),

  -- Transaction Info
  transaction_hash VARCHAR(255), -- Blockchain tx hash
  wallet_address VARCHAR(255),

  -- Status
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method ENUM('crypto_wallet', 'credit_card', 'bank_transfer') DEFAULT 'crypto_wallet',

  -- Risk Agreement
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMP NULL,
  ip_address VARCHAR(45),

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign Keys
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,

  -- Indexes
  INDEX idx_project_id (project_id),
  INDEX idx_investor_id (investor_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_transaction_hash (transaction_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Investment Returns (Tracking actual returns)
-- ============================================

CREATE TABLE IF NOT EXISTS investment_returns (
  id INT PRIMARY KEY AUTO_INCREMENT,

  investment_id INT NOT NULL,

  -- Return Details
  amount DECIMAL(15, 2) NOT NULL,
  return_type ENUM('monthly', 'quarterly', 'annual', 'exit') NOT NULL,

  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Status
  status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  paid_at TIMESTAMP NULL,

  -- Transaction
  transaction_hash VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE,

  INDEX idx_investment_id (investment_id),
  INDEX idx_status (status),
  INDEX idx_paid_at (paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Investment Notes (For tracking special conditions)
-- ============================================

CREATE TABLE IF NOT EXISTS investment_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,

  investment_id INT NOT NULL,
  user_id INT NOT NULL,

  note TEXT NOT NULL,
  note_type ENUM('admin', 'system', 'user') DEFAULT 'system',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_investment_id (investment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
