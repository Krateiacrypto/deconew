import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  let connection: any = null;

  try {
    console.log('🔄 Starting database setup...');

    // First, connect as root to create database and user
    console.log('📍 Connecting to MySQL as root...');
    const rootPassword = process.env.MYSQL_ROOT_PASSWORD || '';

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: 'root',
      password: rootPassword,
    });

    console.log('✅ Connected to MySQL as root');

    // Create database
    console.log('📦 Creating database: decarbonize_dev');
    await connection.execute(
      'CREATE DATABASE IF NOT EXISTS decarbonize_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
    console.log('✅ Database created successfully');

    // Create user
    console.log('👤 Creating database user: decarbonize');
    try {
      await connection.execute(
        `DROP USER IF EXISTS 'decarbonize'@'localhost'`
      );
    } catch (e) {
      // User might not exist yet
    }

    await connection.execute(
      `CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY '${process.env.DB_PASSWORD || 'Dev123!@#'}'`
    );
    console.log('✅ User created successfully');

    // Grant privileges
    console.log('🔐 Granting privileges...');
    await connection.execute(
      `GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost'`
    );
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');

    // Test connection with new user
    console.log('🧪 Testing new user connection...');
    await connection.end();

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: 'decarbonize',
      password: process.env.DB_PASSWORD || 'Dev123!@#',
      database: 'decarbonize_dev'
    });

    console.log('✅ New user connection successful');

    // Verify tables don't exist yet
    const [tables] = await connection.execute('SHOW TABLES') as any;
    if (Array.isArray(tables) && tables.length === 0) {
      console.log('✅ Database is empty and ready for migrations');
    } else {
      console.log('⚠️  Database already has tables.');
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('📝 Next step: Run "npm run migrate" to create tables\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    process.exit(1);
  }
}

setupDatabase();
