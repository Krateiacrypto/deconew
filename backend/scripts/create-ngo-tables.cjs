const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createNGOTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'decarbonize',
    password: process.env.DB_PASSWORD || 'Dev123!@#',
    database: process.env.DB_NAME || 'decarbonize_dev',
    multipleStatements: true,
  });

  console.log('🚀 Creating NGO tables (without triggers)...\n');

  // NGO Registry
  await connection.query(`
    CREATE TABLE IF NOT EXISTS ngo_registry (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL UNIQUE,
      official_name VARCHAR(255) NOT NULL,
      short_name VARCHAR(100) NULL,
      registration_number VARCHAR(100) NOT NULL UNIQUE,
      tax_id VARCHAR(100) NULL,
      country VARCHAR(100) NOT NULL,
      focus_areas JSON NOT NULL,
      mission_statement TEXT NOT NULL,
      vision_statement TEXT NULL,
      website VARCHAR(255) NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NULL,
      social_media JSON NULL,
      verification_status ENUM('pending', 'under_review', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
      verified_at TIMESTAMP NULL,
      verified_by INT NULL,
      has_501c3 BOOLEAN DEFAULT FALSE,
      has_transparency_cert BOOLEAN DEFAULT FALSE,
      transparency_score INT NULL,
      certification_documents JSON NULL,
      total_endorsements INT DEFAULT 0,
      active_endorsements INT DEFAULT 0,
      average_endorsement_level DECIMAL(3,2) DEFAULT 0.00,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_active_at TIMESTAMP NULL,
      profile_completeness INT DEFAULT 0,
      admin_notes TEXT NULL,
      rejection_reason TEXT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_ngo_status (verification_status),
      INDEX idx_ngo_country (country),
      FULLTEXT INDEX idx_ngo_search (official_name, mission_statement)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ ngo_registry created');

  // Project Endorsements
  await connection.query(`
    CREATE TABLE IF NOT EXISTS project_endorsements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      project_id INT NOT NULL,
      ngo_id INT NOT NULL,
      support_level ENUM('LOW', 'MEDIUM', 'HIGH', 'FULL') NOT NULL,
      support_rationale TEXT NOT NULL,
      expertise_alignment TEXT NULL,
      risk_assessment TEXT NULL,
      co_promotion_willing BOOLEAN DEFAULT FALSE,
      technical_assistance_offered BOOLEAN DEFAULT FALSE,
      technical_assistance_details TEXT NULL,
      monetary_commitment DECIMAL(15,2) DEFAULT 0.00,
      monetary_committed BOOLEAN DEFAULT FALSE,
      status ENUM('draft', 'submitted', 'active', 'withdrawn', 'expired') DEFAULT 'draft',
      endorsed_at TIMESTAMP NULL,
      withdrawn_at TIMESTAMP NULL,
      withdrawal_reason TEXT NULL,
      is_public BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      project_completion_percentage INT DEFAULT 0,
      impact_generated TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (ngo_id) REFERENCES ngo_registry(id) ON DELETE CASCADE,
      UNIQUE KEY unique_endorsement (project_id, ngo_id),
      INDEX idx_endorsement_ngo (ngo_id),
      INDEX idx_endorsement_level (support_level),
      INDEX idx_endorsement_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ project_endorsements created');

  // Endorsement History
  await connection.query(`
    CREATE TABLE IF NOT EXISTS endorsement_history (
      id INT PRIMARY KEY AUTO_INCREMENT,
      endorsement_id INT NOT NULL,
      project_id INT NOT NULL,
      ngo_id INT NOT NULL,
      action ENUM('created', 'submitted', 'level_changed', 'rationale_updated', 'activated', 'withdrawn', 'reactivated') NOT NULL,
      from_status VARCHAR(50) NULL,
      to_status VARCHAR(50) NULL,
      from_level VARCHAR(10) NULL,
      to_level VARCHAR(10) NULL,
      notes TEXT NULL,
      changed_by INT NULL,
      changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      metadata JSON NULL,
      FOREIGN KEY (endorsement_id) REFERENCES project_endorsements(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (ngo_id) REFERENCES ngo_registry(id) ON DELETE CASCADE,
      FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_history_endorsement (endorsement_id),
      INDEX idx_history_date (changed_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ endorsement_history created');

  // NGO Team Members
  await connection.query(`
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
  `);
  console.log('✓ ngo_team_members created');

  // NGO Achievements
  await connection.query(`
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
  `);
  console.log('✓ ngo_achievements created');

  // Endorsement Levels Info
  await connection.query(`
    CREATE TABLE IF NOT EXISTS endorsement_levels_info (
      level_code VARCHAR(10) PRIMARY KEY,
      level_name VARCHAR(50) NOT NULL,
      percentage INT NOT NULL,
      badge_text VARCHAR(100) NOT NULL,
      fee_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
      visibility_boost INT DEFAULT 0,
      benefits_description TEXT NULL,
      requirements TEXT NULL,
      UNIQUE KEY unique_percentage (percentage)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ endorsement_levels_info created');

  // Insert endorsement levels
  await connection.query(`
    INSERT IGNORE INTO endorsement_levels_info
    (level_code, level_name, percentage, badge_text, fee_discount_percentage, visibility_boost, benefits_description)
    VALUES
    ('LOW', 'Low Support', 25, 'Supported by [NGO]', 0.00, 10, 'Basic endorsement badge on project page'),
    ('MEDIUM', 'Medium Support', 50, 'Recommended by [NGO]', 5.00, 30, 'Recommended badge + priority listing + 5% fee discount'),
    ('HIGH', 'High Support', 75, 'Highly Recommended', 10.00, 60, 'Highly Recommended badge + featured project + 10% fee discount'),
    ('FULL', 'Full Support', 100, 'NGO Partnered', 20.00, 100, 'NGO Partnered badge + maximum visibility + 20% fee discount + guaranteed promotion')
  `);
  console.log('✓ endorsement_levels_info data inserted');

  // Add endorsement columns to projects (if not exists)
  try {
    await connection.query(`
      ALTER TABLE projects
      ADD COLUMN endorsement_count INT DEFAULT 0,
      ADD COLUMN highest_endorsement_level ENUM('NONE', 'LOW', 'MEDIUM', 'HIGH', 'FULL') DEFAULT 'NONE',
      ADD COLUMN endorsement_benefits JSON NULL
    `);
    console.log('✓ projects table updated with endorsement columns');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('⊗ projects endorsement columns already exist');
    } else {
      throw err;
    }
  }

  console.log('\n✅ All NGO tables created successfully!\n');
  await connection.end();
}

createNGOTables().catch(console.error);
