const Users = require('../models/usersDB'); 
const Messages = require('../models/messagesDB');

exports.get_Summary = async (req, res) => {
    // Queries All Users & Messages From Mongo Collection And Pushes Them in 'summary' Array
    try {
        let summary = []; const users = await Users.find({}, { _id: 0 });
        users.map( async (element, index) => {
            let msg = []; const messages = await Messages.find({user_id: element.user}, { _id: 0 });
            messages.map(async (ele) => { msg.push(ele.message) })
            let userObj = {
                user: element.user, 
                name: element.name, 
                messages: msg
            }
            summary.push(userObj);
            if(users.length - 1 === index) {
                res.json({result: summary});
            }
        });
    } catch (e) { res.json({success: false}); }
}
