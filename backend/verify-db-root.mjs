import mysql from 'mysql2/promise.js';

async function verifyDatabase() {
  try {
    // Try with root user first (no password)
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root'
    });

    console.log('✅ Connected to MySQL as root');

    // Show databases
    const [databases] = await connection.execute('SHOW DATABASES;');
    console.log('\n📊 Databases:');
    databases.forEach((row, idx) => {
      const dbName = row[Object.keys(row)[0]];
      console.log(`  ${idx + 1}. ${dbName}`);
    });

    // Check if decarbonize_dev exists
    const [result] = await connection.execute(
      "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'decarbonize_dev'"
    );

    if (result.length > 0) {
      console.log('\n✅ decarbonize_dev database EXISTS');

      // Get tables in decarbonize_dev
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'decarbonize_dev'"
      );

      if (tables.length === 0) {
        console.log('❌ No tables in decarbonize_dev');
      } else {
        console.log(`\n✅ Found ${tables.length} tables:`);
        tables.forEach((row, idx) => {
          const tableName = row.TABLE_NAME;
          console.log(`  ${idx + 1}. ${tableName}`);
        });
      }
    } else {
      console.log('\n❌ decarbonize_dev database DOES NOT EXIST');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyDatabase();
