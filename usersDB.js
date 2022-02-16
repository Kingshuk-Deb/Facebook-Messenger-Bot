const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    user: Number,
    name: String,
});

const Users = mongoose.model("user", usersSchema);

module.exports = Users;