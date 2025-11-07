-- ============================================================================
-- Migration 007.5: Create Projects Table (Base)
-- Description: Basic projects table for carbon credit platform
-- Created: 2025-10-31
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Basic info
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,

    -- Provider
    provider_id INT NOT NULL,

    -- Status
    status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',

    -- Carbon credits
    carbon_credits DECIMAL(15,2) DEFAULT 0 COMMENT 'Total CO2 credits (tons)',

    -- Funding
    funding_goal DECIMAL(15,2) DEFAULT 0,
    current_funding DECIMAL(15,2) DEFAULT 0,
    min_investment DECIMAL(15,2) DEFAULT 100,

    -- Progress
    progress INT DEFAULT 0 COMMENT '0-100 percentage',

    -- Dates
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL COMMENT 'User who last updated',

    -- Images & media
    image_url VARCHAR(500) NULL,

    -- Verification
    verified BOOLEAN DEFAULT FALSE,

    -- Participants
    participants_count INT DEFAULT 0,

    -- Impact metrics (JSON for flexibility)
    impact_metrics JSON NULL COMMENT 'CO2 reduced, trees planted, etc',

    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_projects_provider (provider_id),
    INDEX idx_projects_status (status),
    INDEX idx_projects_category (category),
    INDEX idx_projects_verified (verified),
    INDEX idx_projects_dates (start_date, end_date),
    FULLTEXT INDEX idx_projects_search (title, description, location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- END OF MIGRATION 007.5
-- ============================================================================
