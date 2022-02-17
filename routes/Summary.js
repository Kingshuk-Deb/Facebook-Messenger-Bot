require('dotenv').config();
const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary');

router.get('/', summaryController.get_Summary);

module.exports = router;