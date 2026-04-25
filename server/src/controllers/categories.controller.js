const pool = require('../config/db');

// GET /api/categories
async function getAllCategories(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, type, color_hex AS colorHex, sort_order AS sortOrder FROM categories ORDER BY type, sort_order'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Kategoriler yüklenirken hata oluştu.' });
  }
}

module.exports = { getAllCategories };
