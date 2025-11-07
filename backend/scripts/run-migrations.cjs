/**
 * Database Migration Runner
 * Runs SQL migration files in order
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'decarbonize',
  password: process.env.DB_PASSWORD || 'Dev123!@#',
  database: process.env.DB_NAME || 'decarbonize_dev',
  multipleStatements: true, // Allow running multiple SQL statements
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function runMigrations() {
  let connection;

  try {
    console.log(`${colors.cyan}🚀 Starting migration process...${colors.reset}\n`);

    // Connect to database
    console.log(`${colors.blue}📡 Connecting to database: ${dbConfig.database}${colors.reset}`);
    connection = await mysql.createConnection(dbConfig);
    console.log(`${colors.green}✓ Connected successfully${colors.reset}\n`);

    // Get migrations directory
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    console.log(`${colors.blue}📂 Reading migrations from: ${migrationsDir}${colors.reset}`);

    // Read all migration files
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically (001_, 002_, etc)

    console.log(`${colors.cyan}Found ${migrationFiles.length} migration files${colors.reset}\n`);

    // Create migrations tracking table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_filename (filename)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Get already executed migrations
    const [executedMigrations] = await connection.query(
      'SELECT filename FROM migrations'
    );
    const executedSet = new Set(executedMigrations.map(row => row.filename));

    // Run pending migrations
    let executed = 0;
    let skipped = 0;

    for (const filename of migrationFiles) {
      if (executedSet.has(filename)) {
        console.log(`${colors.yellow}⊗ Skipping ${filename} (already executed)${colors.reset}`);
        skipped++;
        continue;
      }

      console.log(`${colors.blue}▶ Running ${filename}...${colors.reset}`);

      try {
        // Read migration file
        const filePath = path.join(migrationsDir, filename);
        const sql = await fs.readFile(filePath, 'utf8');

        // Execute migration
        await connection.query(sql);

        // Record successful migration
        await connection.query(
          'INSERT INTO migrations (filename) VALUES (?)',
          [filename]
        );

        console.log(`${colors.green}✓ Successfully executed ${filename}${colors.reset}\n`);
        executed++;

      } catch (error) {
        console.error(`${colors.red}✗ Failed to execute ${filename}${colors.reset}`);
        console.error(`${colors.red}Error: ${error.message}${colors.reset}\n`);

        // Ask user if they want to continue
        console.log(`${colors.yellow}⚠ Migration failed. Stopping process.${colors.reset}`);
        throw error;
      }
    }

    // Summary
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.green}✓ Migration process completed${colors.reset}`);
    console.log(`${colors.cyan}  • Executed: ${executed}${colors.reset}`);
    console.log(`${colors.yellow}  • Skipped: ${skipped}${colors.reset}`);
    console.log(`${colors.cyan}  • Total: ${migrationFiles.length}${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.error(`${colors.red}✗ Migration failed${colors.reset}`);
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    console.error(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    process.exit(1);

  } finally {
    // Close connection
    if (connection) {
      await connection.end();
      console.log(`${colors.blue}📡 Database connection closed${colors.reset}`);
    }
  }
}

// Run migrations
runMigrations();
