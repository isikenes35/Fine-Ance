const pool = require('../config/db');

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
 * Calculates period bounds for a given offset from the current period.
 * offset=0 means the current period, offset=-1 means one period back, etc.
 */
function getPeriodBoundsFromOffset(period, offset, referenceDate) {
  const ref = referenceDate ? new Date(referenceDate + 'T12:00:00') : new Date();

  if (period === 'weekly') {
    const day = ref.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const currentMonday = new Date(ref);
    currentMonday.setDate(ref.getDate() + diffToMonday);

    const targetMonday = new Date(currentMonday);
    targetMonday.setDate(currentMonday.getDate() + offset * 7);
    const targetSunday = new Date(targetMonday);
    targetSunday.setDate(targetMonday.getDate() + 6);

    return {
      start: formatDate(targetMonday),
      end: formatDate(targetSunday),
      label: `${targetMonday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${targetSunday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}`,
    };
  }

  // monthly
  const targetDate = new Date(ref.getFullYear(), ref.getMonth() + offset, 1);
  const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

  return {
    start: formatDate(targetDate),
    end: formatDate(lastDay),
    label: targetDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
  };
}

// GET /api/analytics/history?period=weekly|monthly&count=12
async function getHistory(req, res) {
  try {
    const { period = 'monthly', count = 12 } = req.query;
    const periodCount = Math.min(parseInt(count) || 12, 52);

    if (!['weekly', 'monthly'].includes(period)) {
      return res.status(400).json({ error: 'Geçersiz dönem.' });
    }

    const results = [];

    for (let i = -(periodCount - 1); i <= 0; i++) {
      const bounds = getPeriodBoundsFromOffset(period, i);

      const [rows] = await pool.query(
        `SELECT c.id AS categoryId, c.name AS categoryName, c.type AS categoryType, c.color_hex AS categoryColor,
                COALESCE(SUM(t.amount), 0) AS total
         FROM categories c
         LEFT JOIN transactions t ON t.category_id = c.id
           AND t.entry_date >= ? AND t.entry_date <= ?
         GROUP BY c.id, c.name, c.type, c.color_hex
         ORDER BY c.type, c.sort_order`,
        [bounds.start, bounds.end]
      );

      let totalIncome = 0;
      let totalExpense = 0;
      const byCategory = [];

      for (const row of rows) {
        const amount = parseFloat(row.total);
        if (row.categoryType === 'income') totalIncome += amount;
        else totalExpense += amount;

        byCategory.push({
          id: row.categoryId,
          name: row.categoryName,
          type: row.categoryType,
          colorHex: row.categoryColor,
          total: amount,
        });
      }

      results.push({
        periodLabel: bounds.label,
        periodStart: bounds.start,
        periodEnd: bounds.end,
        totalIncome,
        totalExpense,
        net: totalIncome - totalExpense,
        byCategory,
      });
    }

    res.json(results);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Analiz verileri yüklenirken hata oluştu.' });
  }
}

module.exports = { getHistory };
