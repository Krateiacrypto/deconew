#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'decarbonize';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Dev123!@#';
const DB_NAME = process.env.DB_NAME || 'decarbonize_dev';

async function runMigrations() {
  let connection;

  try {
    console.log('🔄 Connecting to MySQL...');
    console.log(`   Host: ${DB_HOST}:${DB_PORT}`);
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   User: ${DB_USER}`);

    // Create connection
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Connected to database\n');

    // Get all migration files
    const migrationsDir = './migrations';
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('❌ No migration files found!');
      process.exit(1);
    }

    console.log(`📋 Found ${files.length} migration files:\n`);

    let successCount = 0;
    let failureCount = 0;

    // Run each migration
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      try {
        console.log(`▶️  Running: ${file}`);

        // Split by ; to handle multiple statements properly
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const statement of statements) {
          await connection.execute(statement);
        }

        console.log(`   ✅ Success\n`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
        failureCount++;
      }
    }

    // Summary
    console.log('════════════════════════════════════════');
    console.log('📊 MIGRATION SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`✅ Successful: ${successCount}/${files.length}`);
    console.log(`❌ Failed:     ${failureCount}/${files.length}`);

    if (failureCount === 0) {
      console.log('\n🎉 All migrations completed successfully!');
    } else {
      console.log('\n⚠️  Some migrations failed. Check the errors above.');
    }

    // Verify tables were created
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",[DB_NAME]
    );

    console.log(`\n📊 Tables in ${DB_NAME}:`);
    if (tables.length === 0) {
      console.log('   No tables found!');
    } else {
      tables.forEach((row, idx) => {
        console.log(`   ${idx + 1}. ${row.TABLE_NAME}`);
      });
    }

    await connection.end();
    process.exit(failureCount > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

runMigrations();
