import mysql from 'mysql2/promise.js';

async function verifyDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'decarbonize',
      password: 'Dev123!@#',
      database: 'decarbonize_dev'
    });

    console.log('✅ Connected to database');

    // Get list of tables
    const [tables] = await connection.execute('SHOW TABLES;');
    console.log('\n📊 Tables in database:');
    if (tables.length === 0) {
      console.log('  No tables found!');
    } else {
      tables.forEach((row, idx) => {
        const tableName = row[Object.keys(row)[0]];
        console.log(`  ${idx + 1}. ${tableName}`);
      });
    }

    // Check if pending_registrations table exists
    const [result] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'decarbonize_dev' AND TABLE_NAME = 'pending_registrations'"
    );

    if (result.length > 0) {
      console.log('\n✅ pending_registrations table EXISTS');

      // Show table structure
      const [columns] = await connection.execute('DESCRIBE pending_registrations;');
      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } else {
      console.log('\n❌ pending_registrations table DOES NOT EXIST');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyDatabase();
