const Users = require('../models/usersDB'); 
const Messages = require('../models/messagesDB');

exports.get_Summary = async (req, res) => {
    let summary = []; const users = await Users.find({}, { _id: 0 });
    users.map( async (element) => {
        let msg = []; const messages = await Messages.find({user_id: element.user}, { _id: 0 });
        messages.map((ele, index) => { msg.push(ele.message) })
        let userObj = {
            user: element.user, 
            name: element.name, 
            messages: msg
        }
        summary.push(userObj);
    });
    setTimeout(() => { res.json({result: summary}); }, 100);
}