import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  let connection = null;

  try {
    console.log('🔄 Starting migrations...\n');

    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'decarbonize',
      password: process.env.DB_PASSWORD || 'Dev123!@#',
      database: process.env.DB_NAME || 'decarbonize_dev',
    });

    console.log('✅ Connected to database\n');

    // Read migration files
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql') && f !== 'data.sql')
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No migration files found');
      await connection.end();
      process.exit(0);
    }

    console.log(`Found ${files.length} migration(s)\n`);

    // Run each migration
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running: ${file}`);

      try {
        // Split by semicolon and execute
        const statements = sql
          .split(';')
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
          // Skip if statement is only comments
          const cleanStmt = statement
            .split('\n')
            .filter((line) => !line.trim().startsWith('--'))
            .join('\n')
            .trim();

          if (cleanStmt.length > 0) {
            await connection.execute(cleanStmt);
          }
        }

        console.log(`✅ ${file} completed\n`);
      } catch (error) {
        console.error(`❌ ${file} failed:`, error.message);
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully!\n');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        // Ignore
      }
    }
    process.exit(1);
  }
}

runMigrations();
