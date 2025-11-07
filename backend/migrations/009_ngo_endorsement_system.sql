-- ============================================================================
-- Migration 009: NGO Endorsement System (Phase 1)
-- Description: PROJECTS_ARC integration - NGO registry and endorsement
-- Created: 2025-10-31
-- Note: Simplified version - Full donation system in v2.0
-- ============================================================================

-- ============================================================================
-- 1. NGO REGISTRY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ngo_registry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE COMMENT 'Link to users table with NGO role',

    -- Organization details
    official_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    tax_id VARCHAR(100) NULL,
    country VARCHAR(100) NOT NULL,

    -- Focus areas
    focus_areas JSON NOT NULL COMMENT '["Climate Action", "Reforestation", "Ocean Conservation", "Renewable Energy"]',
    mission_statement TEXT NOT NULL,
    vision_statement TEXT NULL,

    -- Contact & web presence
    website VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    social_media JSON NULL COMMENT '{"twitter": "...", "linkedin": "...", "facebook": "..."}',

    -- Verification status
    verification_status ENUM('pending', 'under_review', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    verified_by INT NULL COMMENT 'Admin who approved',

    -- Certifications
    has_501c3 BOOLEAN DEFAULT FALSE COMMENT 'US 501(c)(3) or equivalent',
    has_transparency_cert BOOLEAN DEFAULT FALSE,
    transparency_score INT NULL COMMENT '0-100 score from external rating',
    certification_documents JSON NULL,

    -- Endorsement stats (auto-updated)
    total_endorsements INT DEFAULT 0,
    active_endorsements INT DEFAULT 0,
    average_endorsement_level DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Average of support levels',

    -- Platform engagement
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP NULL,
    profile_completeness INT DEFAULT 0 COMMENT '0-100%',

    -- Admin notes
    admin_notes TEXT NULL,
    rejection_reason TEXT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_ngo_status (verification_status),
    INDEX idx_ngo_country (country),
    FULLTEXT INDEX idx_ngo_search (official_name, mission_statement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. PROJECT ENDORSEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_endorsements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    ngo_id INT NOT NULL COMMENT 'Reference to ngo_registry.id',

    -- Endorsement details
    support_level ENUM('LOW', 'MEDIUM', 'HIGH', 'FULL') NOT NULL COMMENT '25%, 50%, 75%, 100%',
    support_rationale TEXT NOT NULL COMMENT 'Why NGO is endorsing this project',
    expertise_alignment TEXT NULL COMMENT 'How project aligns with NGO expertise',
    risk_assessment TEXT NULL COMMENT 'NGO perspective on project risks',

    -- Support offerings
    co_promotion_willing BOOLEAN DEFAULT FALSE COMMENT 'Will promote on NGO channels',
    technical_assistance_offered BOOLEAN DEFAULT FALSE,
    technical_assistance_details TEXT NULL,

    -- Optional monetary support (Phase 1: tracking only, Phase 2: actual donations)
    monetary_commitment DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Optional financial support pledge',
    monetary_committed BOOLEAN DEFAULT FALSE,

    -- Status
    status ENUM('draft', 'submitted', 'active', 'withdrawn', 'expired') DEFAULT 'draft',
    endorsed_at TIMESTAMP NULL,
    withdrawn_at TIMESTAMP NULL,
    withdrawal_reason TEXT NULL,

    -- Visibility
    is_public BOOLEAN DEFAULT TRUE COMMENT 'Show on project page',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Featured endorsement',

    -- Impact tracking (updated periodically)
    project_completion_percentage INT DEFAULT 0,
    impact_generated TEXT NULL COMMENT 'Description of impact facilitated',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngo_registry(id) ON DELETE CASCADE,

    UNIQUE KEY unique_endorsement (project_id, ngo_id),
    INDEX idx_endorsement_ngo (ngo_id),
    INDEX idx_endorsement_level (support_level),
    INDEX idx_endorsement_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. ENDORSEMENT HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS endorsement_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    endorsement_id INT NOT NULL,
    project_id INT NOT NULL,
    ngo_id INT NOT NULL,

    action ENUM(
        'created',
        'submitted',
        'level_changed',
        'rationale_updated',
        'activated',
        'withdrawn',
        'reactivated'
    ) NOT NULL,

    from_status VARCHAR(50) NULL,
    to_status VARCHAR(50) NULL,
    from_level VARCHAR(10) NULL,
    to_level VARCHAR(10) NULL,

    notes TEXT NULL,
    changed_by INT NULL COMMENT 'NGO user who made the change',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    metadata JSON NULL COMMENT 'Additional context',

    FOREIGN KEY (endorsement_id) REFERENCES project_endorsements(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngo_registry(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_history_endorsement (endorsement_id),
    INDEX idx_history_date (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. ALTER PROJECTS TABLE FOR ENDORSEMENT
-- ============================================================================

ALTER TABLE projects ADD COLUMN endorsement_count INT DEFAULT 0 COMMENT 'Number of active NGO endorsements' AFTER revision_count;
ALTER TABLE projects ADD COLUMN highest_endorsement_level ENUM('NONE', 'LOW', 'MEDIUM', 'HIGH', 'FULL') DEFAULT 'NONE' AFTER endorsement_count;
ALTER TABLE projects ADD COLUMN endorsement_benefits JSON NULL COMMENT 'Calculated benefits: fee_discount, visibility_boost, etc' AFTER highest_endorsement_level;

CREATE INDEX idx_projects_endorsement_count ON projects(endorsement_count);
CREATE INDEX idx_projects_endorsement_level ON projects(highest_endorsement_level);

-- ============================================================================
-- 5. NGO TEAM MEMBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ngo_team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ngo_id INT NOT NULL,

    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(255) NULL,
    bio TEXT NULL,
    photo_url VARCHAR(500) NULL,
    linkedin_url VARCHAR(255) NULL,

    is_primary_contact BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ngo_id) REFERENCES ngo_registry(id) ON DELETE CASCADE,

    INDEX idx_team_ngo (ngo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. NGO ACHIEVEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ngo_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ngo_id INT NOT NULL,

    achievement_type ENUM('award', 'certification', 'milestone', 'partnership', 'media') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    year INT NULL,
    issuing_organization VARCHAR(255) NULL,
    proof_url VARCHAR(500) NULL,

    display_on_profile BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ngo_id) REFERENCES ngo_registry(id) ON DELETE CASCADE,

    INDEX idx_achievements_ngo (ngo_id),
    INDEX idx_achievements_type (achievement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. ENDORSEMENT SUPPORT LEVELS REFERENCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS endorsement_levels_info (
    level_code VARCHAR(10) PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL,
    percentage INT NOT NULL,
    badge_text VARCHAR(100) NOT NULL,
    fee_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    visibility_boost INT DEFAULT 0 COMMENT '0-100, higher = more visible',
    benefits_description TEXT NULL,
    requirements TEXT NULL,

    UNIQUE KEY unique_percentage (percentage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert support levels
INSERT IGNORE INTO endorsement_levels_info (level_code, level_name, percentage, badge_text, fee_discount_percentage, visibility_boost, benefits_description) VALUES
('LOW', 'Low Support', 25, 'Supported by [NGO]', 0.00, 10, 'Basic endorsement badge on project page'),
('MEDIUM', 'Medium Support', 50, 'Recommended by [NGO]', 5.00, 30, 'Recommended badge + priority listing + 5% fee discount'),
('HIGH', 'High Support', 75, 'Highly Recommended', 10.00, 60, 'Highly Recommended badge + featured project + 10% fee discount'),
('FULL', 'Full Support', 100, 'NGO Partnered', 20.00, 100, 'NGO Partnered badge + maximum visibility + 20% fee discount + guaranteed promotion');

-- ============================================================================
-- 8. TRIGGERS FOR AUTO-UPDATING STATS
-- ============================================================================

DELIMITER //

-- Trigger: Update NGO endorsement stats
CREATE TRIGGER after_endorsement_insert
AFTER INSERT ON project_endorsements
FOR EACH ROW
BEGIN
    -- Update NGO stats
    UPDATE ngo_registry
    SET
        total_endorsements = total_endorsements + 1,
        active_endorsements = active_endorsements + IF(NEW.status = 'active', 1, 0),
        average_endorsement_level = (
            SELECT AVG(
                CASE support_level
                    WHEN 'LOW' THEN 0.25
                    WHEN 'MEDIUM' THEN 0.50
                    WHEN 'HIGH' THEN 0.75
                    WHEN 'FULL' THEN 1.00
                END
            )
            FROM project_endorsements
            WHERE ngo_id = NEW.ngo_id AND status = 'active'
        )
    WHERE id = NEW.ngo_id;

    -- Update project stats
    IF NEW.status = 'active' THEN
        UPDATE projects
        SET
            endorsement_count = endorsement_count + 1,
            highest_endorsement_level = (
                SELECT MAX(support_level)
                FROM project_endorsements
                WHERE project_id = NEW.project_id AND status = 'active'
                ORDER BY FIELD(support_level, 'LOW', 'MEDIUM', 'HIGH', 'FULL') DESC
                LIMIT 1
            )
        WHERE id = NEW.project_id;
    END IF;
END//

-- Trigger: Update stats on endorsement status change
CREATE TRIGGER after_endorsement_update
AFTER UPDATE ON project_endorsements
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status OR OLD.support_level != NEW.support_level THEN
        -- Update NGO stats
        UPDATE ngo_registry
        SET
            active_endorsements = (
                SELECT COUNT(*)
                FROM project_endorsements
                WHERE ngo_id = NEW.ngo_id AND status = 'active'
            ),
            average_endorsement_level = (
                SELECT AVG(
                    CASE support_level
                        WHEN 'LOW' THEN 0.25
                        WHEN 'MEDIUM' THEN 0.50
                        WHEN 'HIGH' THEN 0.75
                        WHEN 'FULL' THEN 1.00
                    END
                )
                FROM project_endorsements
                WHERE ngo_id = NEW.ngo_id AND status = 'active'
            )
        WHERE id = NEW.ngo_id;

        -- Update project stats
        UPDATE projects
        SET
            endorsement_count = (
                SELECT COUNT(*)
                FROM project_endorsements
                WHERE project_id = NEW.project_id AND status = 'active'
            ),
            highest_endorsement_level = (
                SELECT support_level
                FROM project_endorsements
                WHERE project_id = NEW.project_id AND status = 'active'
                ORDER BY FIELD(support_level, 'LOW', 'MEDIUM', 'HIGH', 'FULL') DESC
                LIMIT 1
            )
        WHERE id = NEW.project_id;
    END IF;
END//

DELIMITER ;

-- ============================================================================
-- 9. VIEWS FOR EASY QUERYING
-- ============================================================================

-- View: NGO with active endorsements
CREATE OR REPLACE VIEW v_ngo_active_endorsements AS
SELECT
    nr.id AS ngo_id,
    nr.official_name,
    nr.short_name,
    pe.id AS endorsement_id,
    pe.project_id,
    p.title AS project_title,
    pe.support_level,
    pe.endorsed_at,
    eli.badge_text,
    eli.fee_discount_percentage
FROM ngo_registry nr
JOIN project_endorsements pe ON nr.id = pe.ngo_id
JOIN projects p ON pe.project_id = p.id
JOIN endorsement_levels_info eli ON pe.support_level = eli.level_code
WHERE pe.status = 'active'
  AND nr.verification_status = 'approved';

-- View: Projects with endorsements
CREATE OR REPLACE VIEW v_projects_with_endorsements AS
SELECT
    p.id AS project_id,
    p.title,
    p.workflow_stage,
    p.endorsement_count,
    p.highest_endorsement_level,
    GROUP_CONCAT(nr.official_name SEPARATOR ', ') AS endorsing_ngos,
    GROUP_CONCAT(pe.support_level SEPARATOR ', ') AS support_levels
FROM projects p
LEFT JOIN project_endorsements pe ON p.id = pe.project_id AND pe.status = 'active'
LEFT JOIN ngo_registry nr ON pe.ngo_id = nr.id
GROUP BY p.id;

-- ============================================================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_ngo_verification ON ngo_registry(verification_status, verified_at);
CREATE INDEX idx_ngo_focus ON ngo_registry((CAST(focus_areas AS CHAR(500))));
CREATE INDEX idx_endorsement_public ON project_endorsements(is_public, is_featured);
CREATE INDEX idx_endorsement_dates ON project_endorsements(endorsed_at, status);

-- ============================================================================
-- END OF MIGRATION 009
-- ============================================================================

-- Verification queries
-- SELECT COUNT(*) FROM ngo_registry;
-- SELECT COUNT(*) FROM project_endorsements;
-- SELECT * FROM endorsement_levels_info;
-- SELECT * FROM v_ngo_active_endorsements LIMIT 10;
