const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary');

router.get('/', summaryController.get_Summary); // Route Function to Get All User Datas

module.exports = router;
