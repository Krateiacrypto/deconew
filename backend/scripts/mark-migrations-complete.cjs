const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function markComplete() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'decarbonize',
    password: process.env.DB_PASSWORD || 'Dev123!@#',
    database: process.env.DB_NAME || 'decarbonize_dev',
  });

  await connection.query(`
    INSERT IGNORE INTO migrations (filename) VALUES
    ('008_projects_workflow_system.sql'),
    ('009_ngo_endorsement_system.sql')
  `);

  console.log('✓ Migrations marked as complete');
  await connection.end();
}

markComplete();
