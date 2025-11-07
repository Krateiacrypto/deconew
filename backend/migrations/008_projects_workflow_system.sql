-- ============================================================================
-- Migration 008: 7-Stage Project Workflow System
-- Description: PROJECTS_ARC integration - Core workflow tables
-- Created: 2025-10-31
-- ============================================================================

-- ============================================================================
-- 1. ALTER EXISTING PROJECTS TABLE
-- ============================================================================

ALTER TABLE projects ADD COLUMN workflow_stage ENUM(
    'draft',                    -- Provider editing
    'pending_admin_review',     -- Stage 1: Waiting for admin
    'admin_reviewing',          -- Stage 1: Admin is reviewing
    'under_verification',       -- Stage 2: Assigned to verifier
    'verifier_site_visit',      -- Stage 3: Site visit scheduled
    'verifier_reviewing',       -- Stage 3: Verifier preparing audit
    'consultant_review',        -- Stage 4: Consultant reviewing
    'pending_final_approval',   -- Stage 5: Waiting for final admin approval
    'ngo_endorsement',          -- Stage 6: NGO endorsement phase (optional)
    'approved',                 -- Stage 7: Live on platform
    'rejected',                 -- Rejected at any stage
    'revision_requested'        -- Needs provider revision
) DEFAULT 'draft' AFTER status;

ALTER TABLE projects ADD COLUMN workflow_started_at TIMESTAMP NULL AFTER workflow_stage;
ALTER TABLE projects ADD COLUMN workflow_completed_at TIMESTAMP NULL AFTER workflow_started_at;

-- Carbon calculation fields
ALTER TABLE projects ADD COLUMN baseline_emissions DECIMAL(15,2) DEFAULT 0 COMMENT 'Baseline CO2 emissions (tons)' AFTER carbon_credits;
ALTER TABLE projects ADD COLUMN project_emissions DECIMAL(15,2) DEFAULT 0 COMMENT 'Project CO2 emissions (tons)' AFTER baseline_emissions;
ALTER TABLE projects ADD COLUMN co2_reduction_calculated DECIMAL(15,2) DEFAULT 0 COMMENT 'Calculated reduction (baseline - project)' AFTER project_emissions;
ALTER TABLE projects ADD COLUMN token_exchange_rate DECIMAL(10,6) DEFAULT 1.000000 COMMENT 'CO2 tons to token ratio' AFTER co2_reduction_calculated;
ALTER TABLE projects ADD COLUMN calculation_method VARCHAR(100) DEFAULT 'manual' COMMENT 'manual, cdm, vcs, gold_standard' AFTER token_exchange_rate;
ALTER TABLE projects ADD COLUMN calculation_verified BOOLEAN DEFAULT FALSE AFTER calculation_method;
ALTER TABLE projects ADD COLUMN calculation_verified_at TIMESTAMP NULL AFTER calculation_verified;
ALTER TABLE projects ADD COLUMN calculation_verified_by INT NULL AFTER calculation_verified_at;

-- Assignment fields
ALTER TABLE projects ADD COLUMN assigned_verifier_id INT NULL COMMENT 'User ID of assigned verifier' AFTER calculation_verified_by;
ALTER TABLE projects ADD COLUMN assigned_consultant_id INT NULL COMMENT 'User ID of assigned consultant' AFTER assigned_verifier_id;
ALTER TABLE projects ADD COLUMN assigned_at TIMESTAMP NULL AFTER assigned_consultant_id;

-- Rejection/revision fields
ALTER TABLE projects ADD COLUMN rejection_reason TEXT NULL AFTER assigned_at;
ALTER TABLE projects ADD COLUMN rejected_by INT NULL AFTER rejection_reason;
ALTER TABLE projects ADD COLUMN rejected_at TIMESTAMP NULL AFTER rejected_by;
ALTER TABLE projects ADD COLUMN revision_notes TEXT NULL AFTER rejected_at;
ALTER TABLE projects ADD COLUMN revision_count INT DEFAULT 0 AFTER revision_notes;

-- Foreign keys
ALTER TABLE projects
    ADD CONSTRAINT fk_projects_verifier
    FOREIGN KEY (assigned_verifier_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_consultant
    FOREIGN KEY (assigned_consultant_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_calculation_verifier
    FOREIGN KEY (calculation_verified_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_rejected_by
    FOREIGN KEY (rejected_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- 2. PROJECT DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    document_type ENUM(
        'baseline_study',
        'feasibility_report',
        'environmental_impact',
        'financial_plan',
        'monitoring_plan',
        'validation_report',
        'verification_report',
        'certification',
        'site_photos',
        'legal_documents',
        'other'
    ) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL COMMENT 'Size in bytes',
    file_type VARCHAR(50) NOT NULL COMMENT 'MIME type',
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workflow_stage VARCHAR(50) NULL COMMENT 'Stage when uploaded',
    is_required BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    notes TEXT NULL,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_project_docs (project_id),
    INDEX idx_doc_type (document_type),
    INDEX idx_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. WORKFLOW HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    from_stage VARCHAR(50) NULL,
    to_stage VARCHAR(50) NOT NULL,
    changed_by INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action ENUM(
        'submitted',
        'assigned',
        'approved',
        'rejected',
        'revision_requested',
        'resubmitted',
        'escalated',
        'completed'
    ) NOT NULL,
    notes TEXT NULL,
    metadata JSON NULL COMMENT 'Additional data (assignments, reasons, etc)',

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_project_workflow (project_id),
    INDEX idx_workflow_stage (to_stage),
    INDEX idx_workflow_date (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. PROJECT ASSIGNMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('verifier', 'consultant', 'admin', 'ngo') NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    status ENUM('pending', 'accepted', 'in_progress', 'completed', 'declined') DEFAULT 'pending',
    notes TEXT NULL,
    deliverables JSON NULL COMMENT 'Expected deliverables checklist',

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE KEY unique_assignment (project_id, user_id, role),
    INDEX idx_assignments_user (user_id),
    INDEX idx_assignments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. AUDIT REPORTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    verifier_id INT NOT NULL,
    report_type ENUM('preliminary', 'site_visit', 'final', 'annual_monitoring') NOT NULL,
    site_visit_date DATE NULL,
    site_visit_duration INT NULL COMMENT 'Duration in hours',
    site_visit_attendees TEXT NULL,

    -- Audit findings
    baseline_verified BOOLEAN DEFAULT FALSE,
    additionality_confirmed BOOLEAN DEFAULT FALSE,
    leakage_assessed BOOLEAN DEFAULT FALSE,
    permanence_verified BOOLEAN DEFAULT FALSE,
    monitoring_plan_adequate BOOLEAN DEFAULT FALSE,

    -- Carbon calculation review
    carbon_calculation_reviewed BOOLEAN DEFAULT FALSE,
    carbon_calculation_approved BOOLEAN DEFAULT FALSE,
    carbon_adjustment_factor DECIMAL(5,2) DEFAULT 1.00 COMMENT 'Multiplier for carbon credits',
    carbon_notes TEXT NULL,

    -- Overall assessment
    overall_score INT NULL COMMENT '0-100 score',
    risk_level ENUM('low', 'medium', 'high', 'critical') NULL,
    recommendation ENUM('approve', 'approve_with_conditions', 'request_revision', 'reject') NOT NULL,
    conditions TEXT NULL,
    findings TEXT NULL,

    -- Evidence
    evidence_photos_count INT DEFAULT 0,
    evidence_documents_count INT DEFAULT 0,
    evidence_interviews_count INT DEFAULT 0,

    -- Metadata
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INT NULL COMMENT 'Admin who reviewed the audit',
    reviewed_at TIMESTAMP NULL,
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected') DEFAULT 'draft',

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (verifier_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_audit_project (project_id),
    INDEX idx_audit_verifier (verifier_id),
    INDEX idx_audit_type (report_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. SITE VISITS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_visits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    verifier_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NULL,
    duration_hours INT DEFAULT 4,
    visit_type ENUM('preliminary', 'full_audit', 'monitoring', 'follow_up') NOT NULL,

    -- Location details
    location_address TEXT NULL,
    location_coordinates VARCHAR(100) NULL COMMENT 'lat,lng',

    -- Attendees
    provider_representatives TEXT NULL,
    local_stakeholders TEXT NULL,
    other_attendees TEXT NULL,

    -- Status
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    completion_date DATE NULL,

    -- Visit notes
    visit_notes TEXT NULL,
    findings_summary TEXT NULL,
    photos_uploaded INT DEFAULT 0,

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (verifier_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_visit_project (project_id),
    INDEX idx_visit_verifier (verifier_id),
    INDEX idx_visit_date (scheduled_date),
    INDEX idx_visit_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. CARBON CALCULATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS carbon_calculations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,

    -- Baseline scenario
    baseline_emissions DECIMAL(15,2) NOT NULL COMMENT 'Tons CO2e per year',
    baseline_methodology VARCHAR(200) NULL,
    baseline_data_source VARCHAR(200) NULL,
    baseline_calculation_date DATE NULL,

    -- Project scenario
    project_emissions DECIMAL(15,2) NOT NULL COMMENT 'Tons CO2e per year',
    project_methodology VARCHAR(200) NULL,
    project_data_source VARCHAR(200) NULL,

    -- Reduction calculation
    annual_reduction DECIMAL(15,2) GENERATED ALWAYS AS (baseline_emissions - project_emissions) STORED,
    project_lifetime_years INT DEFAULT 10,
    total_reduction DECIMAL(15,2) GENERATED ALWAYS AS ((baseline_emissions - project_emissions) * project_lifetime_years) STORED,

    -- Adjustments
    leakage_factor DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Percentage of leakage',
    uncertainty_factor DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Uncertainty deduction',
    buffer_factor DECIMAL(5,2) DEFAULT 0.10 COMMENT 'Conservative buffer (default 10%)',

    -- Net calculation
    net_reduction DECIMAL(15,2) NULL COMMENT 'After all adjustments',

    -- Tokenomics
    token_exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    total_tokens DECIMAL(15,2) NULL COMMENT 'Net reduction * exchange rate',

    -- Verification
    calculated_by INT NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    verification_status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
    verification_notes TEXT NULL,

    -- Methodology reference
    methodology_standard ENUM('CDM', 'VCS', 'Gold Standard', 'ACR', 'CAR', 'Custom') NULL,
    methodology_version VARCHAR(50) NULL,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (calculated_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_calculation_project (project_id),
    INDEX idx_calculation_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. INITIAL DATA - WORKFLOW STAGE DESCRIPTIONS
-- ============================================================================

-- Create a reference table for workflow stage descriptions (for UI)
CREATE TABLE IF NOT EXISTS workflow_stage_info (
    stage_code VARCHAR(50) PRIMARY KEY,
    stage_number INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    required_role VARCHAR(50) NULL,
    typical_duration_days INT NULL,
    next_stages JSON NULL COMMENT 'Possible next stages',

    UNIQUE KEY unique_stage_number (stage_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert workflow stages
INSERT IGNORE INTO workflow_stage_info (stage_code, stage_number, stage_name, description, required_role, typical_duration_days, next_stages) VALUES
('draft', 0, 'Draft', 'Provider is preparing the project submission', 'provider', NULL, '["pending_admin_review"]'),
('pending_admin_review', 1, 'Pending Admin Review', 'Waiting for admin to review and assign verifier', 'admin', 3, '["admin_reviewing", "rejected", "revision_requested"]'),
('admin_reviewing', 1, 'Admin Reviewing', 'Admin is reviewing the project submission', 'admin', 2, '["under_verification", "rejected", "revision_requested"]'),
('under_verification', 2, 'Under Verification', 'Assigned to verifier for initial review', 'verifier', 5, '["verifier_site_visit", "rejected", "revision_requested"]'),
('verifier_site_visit', 3, 'Site Visit Scheduled', 'Verifier conducting site visit and audit', 'verifier', 7, '["verifier_reviewing"]'),
('verifier_reviewing', 3, 'Verifier Reviewing', 'Verifier preparing audit report', 'verifier', 5, '["consultant_review", "rejected", "revision_requested"]'),
('consultant_review', 4, 'Consultant Review', 'Consultant reviewing documentation and communication', 'consultant', 3, '["pending_final_approval", "revision_requested"]'),
('pending_final_approval', 5, 'Pending Final Approval', 'Waiting for final admin approval', 'admin', 2, '["ngo_endorsement", "approved", "rejected"]'),
('ngo_endorsement', 6, 'NGO Endorsement (Optional)', 'NGOs can endorse the project', 'ngo', 7, '["approved"]'),
('approved', 7, 'Approved - Live', 'Project is live on the platform', NULL, NULL, '[]'),
('rejected', 99, 'Rejected', 'Project rejected', NULL, NULL, '[]'),
('revision_requested', 98, 'Revision Requested', 'Provider needs to revise and resubmit', 'provider', NULL, '["pending_admin_review"]');

-- ============================================================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Projects workflow queries
CREATE INDEX idx_projects_workflow_stage ON projects(workflow_stage);
CREATE INDEX idx_projects_workflow_dates ON projects(workflow_started_at, workflow_completed_at);
CREATE INDEX idx_projects_assigned_verifier ON projects(assigned_verifier_id);
CREATE INDEX idx_projects_assigned_consultant ON projects(assigned_consultant_id);
CREATE INDEX idx_projects_carbon_verified ON projects(calculation_verified);

-- ============================================================================
-- 10. TRIGGERS FOR AUDIT TRAIL
-- ============================================================================

DELIMITER //

-- Trigger: Auto-create workflow history on stage change
CREATE TRIGGER after_project_stage_update
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
    IF OLD.workflow_stage != NEW.workflow_stage THEN
        INSERT INTO workflow_history (
            project_id,
            from_stage,
            to_stage,
            changed_by,
            action,
            notes
        ) VALUES (
            NEW.id,
            OLD.workflow_stage,
            NEW.workflow_stage,
            NEW.updated_by,
            CASE
                WHEN NEW.workflow_stage = 'rejected' THEN 'rejected'
                WHEN NEW.workflow_stage = 'revision_requested' THEN 'revision_requested'
                WHEN NEW.workflow_stage = 'approved' THEN 'approved'
                WHEN OLD.workflow_stage = 'revision_requested' THEN 'resubmitted'
                ELSE 'approved'
            END,
            CONCAT('Stage changed from ', OLD.workflow_stage, ' to ', NEW.workflow_stage)
        );
    END IF;
END//

DELIMITER ;

-- ============================================================================
-- END OF MIGRATION 008
-- ============================================================================

-- Verification queries (run these to verify migration success)
-- SELECT COUNT(*) FROM project_documents;
-- SELECT COUNT(*) FROM workflow_history;
-- SELECT COUNT(*) FROM project_assignments;
-- SELECT COUNT(*) FROM audit_reports;
-- SELECT COUNT(*) FROM site_visits;
-- SELECT COUNT(*) FROM carbon_calculations;
-- SELECT * FROM workflow_stage_info ORDER BY stage_number;
