const pool = require('../config/db');
const { createTransactionSchema, updateTransactionSchema } = require('../schemas/transaction.schema');

/**
 * Formats a Date object as YYYY-MM-DD using local time (not UTC).
 */
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the start and end dates for a given period.
 * weekly = Monday to Sunday of the week containing `date`
 * monthly = 1st to last day of the month containing `date`
 */
function getPeriodBounds(period, dateStr) {
  const date = new Date(dateStr + 'T12:00:00'); // noon to avoid DST edge cases

  if (period === 'weekly') {
    const day = date.getDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: formatDate(monday),
      end: formatDate(sunday),
    };
  }

  // monthly
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
}

// POST /api/transactions
async function createTransaction(req, res) {
  try {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { categoryId, amount, description, entryDate } = parsed.data;

    const [result] = await pool.query(
      'INSERT INTO transactions (category_id, amount, description, entry_date) VALUES (?, ?, ?, ?)',
      [categoryId, amount, description || null, entryDate]
    );

    const [rows] = await pool.query(
      `SELECT t.id, t.amount, t.description, t.entry_date AS entryDate, t.created_at AS createdAt,
              c.id AS categoryId, c.name AS categoryName, c.type AS categoryType, c.color_hex AS categoryColor
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    const row = rows[0];
    res.status(201).json({
      id: row.id,
      amount: parseFloat(row.amount),
      description: row.description,
      entryDate: row.entryDate,
      createdAt: row.createdAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
        type: row.categoryType,
        colorHex: row.categoryColor,
      },
    });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'İşlem oluşturulurken hata oluştu.' });
  }
}

// GET /api/transactions?period=weekly|monthly&date=YYYY-MM-DD
async function getTransactions(req, res) {
  try {
    const { period = 'monthly', date } = req.query;

    if (!['weekly', 'monthly'].includes(period)) {
      return res.status(400).json({ error: 'Geçersiz dönem. "weekly" veya "monthly" kullanın.' });
    }

    const anchorDate = date || new Date().toISOString().slice(0, 10);
    const { start, end } = getPeriodBounds(period, anchorDate);

    const [rows] = await pool.query(
      `SELECT t.id, t.amount, t.description, t.entry_date AS entryDate, t.created_at AS createdAt,
              c.id AS categoryId, c.name AS categoryName, c.type AS categoryType, c.color_hex AS categoryColor
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.entry_date >= ? AND t.entry_date <= ?
       ORDER BY t.entry_date DESC, t.created_at DESC`,
      [start, end]
    );

    const transactions = rows.map((row) => ({
      id: row.id,
      amount: parseFloat(row.amount),
      description: row.description,
      entryDate: row.entryDate,
      createdAt: row.createdAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
        type: row.categoryType,
        colorHex: row.categoryColor,
      },
    }));

    res.json({ transactions, periodStart: start, periodEnd: end });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'İşlemler yüklenirken hata oluştu.' });
  }
}

// PUT /api/transactions/:id
async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const parsed = updateTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const fields = [];
    const values = [];

    if (parsed.data.categoryId !== undefined) {
      fields.push('category_id = ?');
      values.push(parsed.data.categoryId);
    }
    if (parsed.data.amount !== undefined) {
      fields.push('amount = ?');
      values.push(parsed.data.amount);
    }
    if (parsed.data.description !== undefined) {
      fields.push('description = ?');
      values.push(parsed.data.description);
    }
    if (parsed.data.entryDate !== undefined) {
      fields.push('entry_date = ?');
      values.push(parsed.data.entryDate);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Güncellenecek alan belirtilmedi.' });
    }

    values.push(id);
    await pool.query(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query(
      `SELECT t.id, t.amount, t.description, t.entry_date AS entryDate, t.created_at AS createdAt,
              c.id AS categoryId, c.name AS categoryName, c.type AS categoryType, c.color_hex AS categoryColor
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'İşlem bulunamadı.' });
    }

    const row = rows[0];
    res.json({
      id: row.id,
      amount: parseFloat(row.amount),
      description: row.description,
      entryDate: row.entryDate,
      createdAt: row.createdAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
        type: row.categoryType,
        colorHex: row.categoryColor,
      },
    });
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'İşlem güncellenirken hata oluştu.' });
  }
}

// DELETE /api/transactions/:id
async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'İşlem bulunamadı.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'İşlem silinirken hata oluştu.' });
  }
}

module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction };
