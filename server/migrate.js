/**
 * Migration runner — executes 001_init.sql against MySQL
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('🔗 MySQL bağlantısı kuruldu.');

  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_init.sql'),
    'utf8'
  );

  await connection.query(sql);
  console.log('✅ Veritabanı ve tablolar oluşturuldu.');

  await connection.end();
}

migrate().catch((err) => {
  console.error('❌ Migration hatası:', err.message);
  process.exit(1);
});
