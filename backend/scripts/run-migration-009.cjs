const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runMigration009() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'decarbonize',
    password: process.env.DB_PASSWORD || 'Dev123!@#',
    database: process.env.DB_NAME || 'decarbonize_dev',
    multipleStatements: true,
  });

  console.log('Running migration 009...');

  const sql = await fs.readFile(
    path.join(__dirname, '..', 'migrations', '009_ngo_endorsement_system.sql'),
    'utf8'
  );

  try {
    await connection.query(sql);
    console.log('✓ Migration 009 executed successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }

  await connection.end();
}

runMigration009();
