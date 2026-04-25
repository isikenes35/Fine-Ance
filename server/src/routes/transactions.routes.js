const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactions.controller');

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
