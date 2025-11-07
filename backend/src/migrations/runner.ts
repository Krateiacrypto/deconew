import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql') && f !== 'data.sql')
      .sort();

    if (files.length === 0) {
      logger.warn('No migration files found');
      process.exit(0);
    }

    logger.info(`Found ${files.length} migration file(s)`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      logger.info(`Running migration: ${file}`);

      try {
        const connection = await pool.getConnection();

        // Split and execute multiple statements
        const statements = sql
          .split(';')
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        for (const statement of statements) {
          await connection.execute(statement);
        }

        connection.release();
        logger.info(`✅ ${file} completed successfully`);
      } catch (error) {
        logger.error(`❌ ${file} failed:`, error);
        throw error;
      }
    }

    logger.info('✅ All migrations completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
