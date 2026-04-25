/**
 * Seed runner — inserts fixed categories into the database
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fineance',
    multipleStatements: true,
  });

  console.log('🔗 MySQL bağlantısı kuruldu.');

  const sql = fs.readFileSync(
    path.join(__dirname, 'seed', 'categories.sql'),
    'utf8'
  );

  await connection.query(sql);
  console.log('✅ Kategoriler eklendi.');

  await connection.end();
}

seed().catch((err) => {
  console.error('❌ Seed hatası:', err.message);
  process.exit(1);
});
