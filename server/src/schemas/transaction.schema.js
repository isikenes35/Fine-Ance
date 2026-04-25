const { z } = require('zod');

const createTransactionSchema = z.object({
  categoryId: z.number().int().positive('Kategori seçilmelidir.'),
  amount: z.number().positive('Tutar pozitif olmalıdır.'),
  description: z.string().max(255).optional().nullable(),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih formatı YYYY-MM-DD olmalıdır.'),
});

const updateTransactionSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(255).optional().nullable(),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

module.exports = { createTransactionSchema, updateTransactionSchema };
