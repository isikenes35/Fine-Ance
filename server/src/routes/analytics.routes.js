const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/analytics.controller');

router.get('/history', getHistory);

module.exports = router;
