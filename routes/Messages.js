const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');

router.get('/', messageController.get_all_messages); // Route Function To Get All Messages
router.get('/:id', messageController.get_message_byID); // Route Function To Get Message by Message ID

module.exports = router;
