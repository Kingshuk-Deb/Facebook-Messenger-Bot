const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    user_id: Number,
    message_id: String,
    message: String,
});

const Messages = mongoose.model("message", messagesSchema);

module.exports = Messages;