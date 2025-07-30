
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  const connectionUrl = process.env.DATABASE_URL;
  if (!connectionUrl) {
    console.error('Error: DATABASE_URL is not defined in your .env file.');
    return;
  }

  console.log(`Attempting to connect to: ${connectionUrl.replace(/:[^:]*@/, ':[PASSWORD_HIDDEN]@')}`);

  try {
    const connection = await mysql.createConnection(connectionUrl);
    console.log('✅ Database connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error.message);
    // Log additional error details for debugging
    if (error.code) console.error(`Error Code: ${error.code}`);
    if (error.errno) console.error(`Error Number: ${error.errno}`);
    if (error.sqlState) console.error(`SQL State: ${error.sqlState}`);
  }
}

testConnection();
