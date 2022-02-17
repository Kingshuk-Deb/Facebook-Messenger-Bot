require('dotenv').config();
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');

router.get('/', messageController.get_all_messages);
router.get('/:id', messageController.get_message_byID);

module.exports = router;