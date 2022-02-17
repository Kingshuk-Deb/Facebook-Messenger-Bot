const Messages = require('../models/messagesDB');

exports.get_all_messages = async (req, res) => {
    let msg = []; const messages = await Messages.find({}, { _id: 0 });
    messages.map((element) => { msg.push({ message: element.message, id: element.message_id  }) })
    res.json({messages: msg});
}

exports.get_message_byID = async (req, res) => {
    const message = await Messages.find( { message_id: req.params.id }, { message: 1, _id: 0 });
    res.json({ message: message[0].message });
}