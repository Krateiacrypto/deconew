#!/usr/bin/env node
import mysql from 'mysql2/promise.js';
import bcrypt from 'bcryptjs';

async function setupTestAdmin() {
  let connection;

  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'decarbonize',
      password: 'Dev123!@#',
      database: 'decarbonize_dev'
    });

    console.log('✅ Connected to database\n');

    // Hash password
    const password = 'AdminPass123!@#';
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('📝 Creating test admin user...');
    console.log(`   Email: admin@test.local`);
    console.log(`   Password: ${password}\n`);

    // Insert admin user with role_id = 1 (super_admin)
    const [result] = await connection.execute(
      `INSERT INTO users (
        email, password_hash, first_name, last_name,
        status, user_type, kyc_level, kyc_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'admin@test.local',
        passwordHash,
        'Admin',
        'Test',
        'active',
        'individual',
        'level_0',
        'not_started'
      ]
    );

    const userId = result.insertId;
    console.log(`✅ User created with ID: ${userId}\n`);

    // Assign super_admin role
    await connection.execute(
      `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
      [userId, 1] // 1 = super_admin
    );

    console.log('✅ super_admin role assigned\n');

    // Create some test registrations for approval workflow
    console.log('📝 Creating test registrations...\n');

    const testRegistrations = [
      {
        email: 'investor1@test.local',
        password: 'InvestorPass123!',
        firstName: 'John',
        lastName: 'Investor'
      },
      {
        email: 'provider1@test.local',
        password: 'ProviderPass123!',
        firstName: 'Jane',
        lastName: 'Provider'
      },
      {
        email: 'advisor1@test.local',
        password: 'AdvisorPass123!',
        firstName: 'Bob',
        lastName: 'Advisor'
      }
    ];

    for (const reg of testRegistrations) {
      const hash = await bcrypt.hash(reg.password, 12);
      const [r] = await connection.execute(
        `INSERT INTO pending_registrations (
          email, password_hash, first_name, last_name, status
        ) VALUES (?, ?, ?, ?, ?)`,
        [reg.email, hash, reg.firstName, reg.lastName, 'submitted']
      );
      console.log(`✅ Created registration: ${reg.email} (ID: ${r.insertId})`);
    }

    console.log('\n════════════════════════════════════════');
    console.log('✅ TEST SETUP COMPLETE');
    console.log('════════════════════════════════════════\n');

    console.log('📋 TEST CREDENTIALS:');
    console.log(`\n1. Admin User (for testing admin endpoints):`);
    console.log(`   Email: admin@test.local`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: super_admin (ID: 1)\n`);

    console.log(`2. Pending Registrations (for approval workflow):`);
    testRegistrations.forEach(reg => {
      console.log(`   - ${reg.email} (Password: ${reg.password})`);
    });

    console.log(`\n3. Testing Instructions:`);
    console.log(`   a) Login as admin to get JWT token`);
    console.log(`   b) Use token to test admin endpoints`);
    console.log(`   c) Test registration approval workflow\n`);

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

setupTestAdmin();
