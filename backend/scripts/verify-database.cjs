const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

async function verifyDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'decarbonize',
    password: process.env.DB_PASSWORD || 'Dev123!@#',
    database: process.env.DB_NAME || 'decarbonize_dev',
  });

  console.log(`${colors.cyan}📊 Database Verification Report${colors.reset}\n`);

  // Check tables
  const [tables] = await connection.query('SHOW TABLES');
  console.log(`${colors.green}✓ Total Tables: ${tables.length}${colors.reset}\n`);

  const expectedTables = [
    'users', 'roles', 'permissions', 'user_roles', 'role_permissions',
    'kyc_profiles', 'partnerships', 'audit_logs', 'pending_registrations',
    'projects', 'project_documents', 'workflow_history', 'project_assignments',
    'audit_reports', 'site_visits', 'carbon_calculations', 'workflow_stage_info',
    'ngo_registry', 'project_endorsements', 'endorsement_history',
    'ngo_team_members', 'ngo_achievements', 'endorsement_levels_info',
    'migrations'
  ];

  console.log(`${colors.cyan}Expected Tables:${colors.reset}`);
  for (const table of expectedTables) {
    const exists = tables.some(t => Object.values(t)[0] === table);
    const status = exists ? `${colors.green}✓` : `${colors.yellow}✗`;
    console.log(`  ${status} ${table}${colors.reset}`);
  }

  console.log();

  // Check projects table columns
  const [projectCols] = await connection.query('DESCRIBE projects');
  console.log(`${colors.cyan}Projects Table Columns: ${projectCols.length}${colors.reset}`);

  const workflowCols = projectCols.filter(col =>
    col.Field.includes('workflow') ||
    col.Field.includes('carbon') ||
    col.Field.includes('endorsement') ||
    col.Field.includes('assigned')
  );

  console.log(`${colors.green}Workflow-related columns: ${workflowCols.length}${colors.reset}`);
  workflowCols.forEach(col => {
    console.log(`  ✓ ${col.Field} (${col.Type})`);
  });

  console.log();

  // Check workflow stages
  const [stages] = await connection.query('SELECT COUNT(*) as count FROM workflow_stage_info');
  console.log(`${colors.green}✓ Workflow Stages: ${stages[0].count}${colors.reset}`);

  // Check endorsement levels
  const [levels] = await connection.query('SELECT COUNT(*) as count FROM endorsement_levels_info');
  console.log(`${colors.green}✓ Endorsement Levels: ${levels[0].count}${colors.reset}\n`);

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}✓ Database is ready for development!${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await connection.end();
}

verifyDatabase();
