#!/usr/bin/env node
import mysql from 'mysql2/promise.js';

async function verifyData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'decarbonize',
    password: 'Dev123!@#',
    database: 'decarbonize_dev'
  });

  try {
    console.log('📊 Checking pending_registrations table:\n');
    const [registrations] = await connection.execute(
      'SELECT id, email, status, created_at FROM pending_registrations'
    );

    registrations.forEach(reg => {
      console.log(`✅ ID: ${reg.id}, Email: ${reg.email}, Status: ${reg.status}`);
    });

    console.log('\n📊 Checking users table:\n');
    const [users] = await connection.execute(
      'SELECT id, email, status FROM users LIMIT 10'
    );

    if (users.length === 0) {
      console.log('(No users yet - waiting for admin approval)');
    } else {
      users.forEach(user => {
        console.log(`✅ ID: ${user.id}, Email: ${user.email}, Status: ${user.status}`);
      });
    }

    console.log('\n✅ Database verification complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

verifyData();
