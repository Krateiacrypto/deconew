#!/usr/bin/env node
import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'decarbonize';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Dev123!@#';
const DB_NAME = process.env.DB_NAME || 'decarbonize_dev';

async function cleanAndMigrate() {
  let connection;

  try {
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Connected\n');

    // Drop all tables if they exist
    console.log('🗑️  Dropping existing tables...');
    const dropStatements = [
      'DROP TABLE IF EXISTS partnership_members;',
      'DROP TABLE IF EXISTS user_roles;',
      'DROP TABLE IF EXISTS role_permissions;',
      'DROP TABLE IF EXISTS permissions;',
      'DROP TABLE IF EXISTS pending_registrations;',
      'DROP TABLE IF EXISTS audit_logs;',
      'DROP TABLE IF EXISTS partnerships;',
      'DROP TABLE IF EXISTS kyc_profiles;',
      'DROP TABLE IF EXISTS roles;',
      'DROP TABLE IF EXISTS users;'
    ];

    for (const stmt of dropStatements) {
      try {
        await connection.execute(stmt);
      } catch (e) {
        // Ignore if table doesn't exist
      }
    }
    console.log('✅ Tables dropped\n');

    // Create all tables
    console.log('📊 Creating tables...\n');

    const statements = [
      // 1. users
      `CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        country VARCHAR(100),
        organization_name VARCHAR(255),
        organization_type VARCHAR(50),
        language VARCHAR(10) DEFAULT 'en',
        status ENUM('pending_approval', 'email_verified', 'under_review', 'active', 'suspended', 'inactive') DEFAULT 'pending_approval',
        kyc_level ENUM('level_0', 'level_1', 'level_2', 'level_3') DEFAULT 'level_0',
        kyc_status ENUM('not_started', 'pending', 'approved', 'rejected') DEFAULT 'not_started',
        user_type ENUM('individual', 'institutional', 'advisor', 'verifier', 'partner') DEFAULT 'individual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 2. roles
      `CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        type ENUM('system', 'partnership') DEFAULT 'system',
        permission_level INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 3. Insert default roles
      `INSERT IGNORE INTO roles (id, name, description, type, permission_level) VALUES
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
        (11, 'user', 'Regular user', 'system', 10);`,

      // 4. permissions
      `CREATE TABLE permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        resource VARCHAR(100),
        action VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_resource_action (resource, action)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 5. role_permissions
      `CREATE TABLE role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        INDEX idx_role_id (role_id),
        INDEX idx_permission_id (permission_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 6. user_roles
      `CREATE TABLE user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_by INT,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_role_id (role_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 7. kyc_profiles
      `CREATE TABLE kyc_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        kyc_level ENUM('level_0', 'level_1', 'level_2', 'level_3') DEFAULT 'level_0',
        status ENUM('not_started', 'pending', 'approved', 'rejected') DEFAULT 'not_started',
        id_document_type VARCHAR(50),
        id_document_number VARCHAR(100),
        date_of_birth DATE,
        nationality VARCHAR(100),
        proof_of_address VARCHAR(255),
        tax_id VARCHAR(100),
        business_registration VARCHAR(255),
        annual_revenue DECIMAL(15, 2),
        employees_count INT,
        office_address TEXT,
        business_license VARCHAR(255),
        reviewed_by INT,
        review_notes TEXT,
        reviewed_at TIMESTAMP NULL,
        rejection_reason TEXT,
        rejected_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_kyc_level (kyc_level),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 8. partnerships
      `CREATE TABLE partnerships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('b2b', 'b2c', 'affiliate', 'reseller', 'integrator') DEFAULT 'b2b',
        owner_id INT NOT NULL,
        partner_company_name VARCHAR(255),
        partner_website VARCHAR(255),
        partner_email VARCHAR(255),
        status ENUM('pending', 'active', 'suspended', 'terminated') DEFAULT 'pending',
        commission_rate DECIMAL(5, 2),
        min_monthly_volume DECIMAL(15, 2),
        payment_terms VARCHAR(50),
        custom_role_id INT,
        contract_url VARCHAR(255),
        contract_start_date DATE,
        contract_end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (custom_role_id) REFERENCES roles(id) ON DELETE SET NULL,
        INDEX idx_owner_id (owner_id),
        INDEX idx_status (status),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 9. partnership_members
      `CREATE TABLE partnership_members (
        partnership_id INT NOT NULL,
        user_id INT NOT NULL,
        role_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (partnership_id, user_id),
        FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
        INDEX idx_partnership_id (partnership_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 10. audit_logs
      `CREATE TABLE audit_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100),
        resource_id INT,
        changes JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('success', 'failure', 'warning') DEFAULT 'success',
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_action (action),
        INDEX idx_resource_type (resource_type),
        INDEX idx_created_at (created_at),
        INDEX idx_user_action (user_id, action, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      // 11. pending_registrations
      `CREATE TABLE pending_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        country VARCHAR(100),
        organization_name VARCHAR(255),
        organization_type VARCHAR(50),
        language VARCHAR(10) DEFAULT 'en',
        status ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
        reviewed_by INT,
        review_notes TEXT,
        reviewed_at TIMESTAMP NULL,
        rejection_reason TEXT,
        rejected_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    ];

    let successCount = 0;
    for (const stmt of statements) {
      try {
        await connection.execute(stmt);
        successCount++;
        const name = stmt.match(/CREATE TABLE.*?(\w+)|INSERT INTO.*?(\w+)|^/)[1] || stmt.substring(0, 20);
        console.log(`✅ ${name}`);
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

    console.log('\n════════════════════════════════════════');
    console.log(`✅ ${successCount}/${statements.length} statements executed`);

    // Verify tables
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME", [DB_NAME]
    );

    console.log(`\n📊 Tables created in ${DB_NAME}:`);
    tables.forEach((row, idx) => {
      console.log(`   ${idx + 1}. ${row.TABLE_NAME}`);
    });

    console.log('\n🎉 Database setup complete!');
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

cleanAndMigrate();
