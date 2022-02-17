const Messages = require('../models/messagesDB');
const Users = require('../models/usersDB'); 

const { validate, negate, sayHi, options } = require('../controllers/onLoad');
const shortid = require('shortid');

async function conversation (chat) {
    chat.getUserProfile().then( async (user) => {
        try {
            await chat.say(sayHi, options); // Starting The Conversation
            
            // Finding If The Current User Exists in The Database
            const userFlag = await Users.find({ user: parseInt(user.id) }, { user: 1, _id: 0 });
            
            // Asking User's Name
            const askName = (convo) => { // Asking User's Name
                convo.ask(`What's your name?`, async (payload, convo) => {
                    const text = payload.message.text;
                    // If The User Is New Then Store It In Database
                    if(userFlag.length === 0) { const newUser = new Users({ user: parseInt(user.id), name: text }); await Users.create(newUser); } 
                    // If The Text/Chat From User Isn't Undefined Then Store In Database
                    if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
                    convo.set('name', text);
                    convo.say(`Oh, your name is ${text}`).then(() => askBirthDate(convo));
                });
            };
            
            // Asking User's BirthDate
            const askBirthDate = (convo) => { 
                convo.ask(`What's your birth date? [YYYY-MM-DD]`, async (payload, convo) => {
                    const text = payload.message.text;
                    // If The Text/Chat From User Isn't Undefined Then Store In Database
                    if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
                    convo.set('birthDate', text);
                    convo.say(`Got it, your birth date is ${text}`).then(() => sendSummary(convo));
                });
            };
            
            // Displaying All The Input's To The User
            const sendSummary = (convo) => { convo.say(`Ok, here's what you told me about you:${'\n'}- Name: ${convo.get('name')}${'\n'}- Birth Date: ${convo.get('birthDate')}`).then(() => askLast(convo)); };
            
            // Asking For Confirmation To Show The Days Left
            const askLast = (convo) => { 
                convo.ask(`Do you want to know how many days left in your birth date?`, async (payload, convo) => {
                    const text = payload.message.text;
                    // If The Text/Chat From User Isn't Undefined Then Store In Database
                    if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
                    // Checking If It Is A Validation/Negation
                    const result1 = validate.indexOf(text.toLowerCase()), result2 = negate.indexOf(text.toLowerCase());
                    if(result1 !== -1) {
                        let birthDate = convo.get('birthDate'), birthMonth = parseInt(birthDate.substring(5,7)), birthDay = parseInt(birthDate.substring(8));
                        let dateNow = new Date(), yearNow = dateNow.getFullYear(), monthNow = dateNow.getMonth() + 1, dayNow = dateNow.getDate();
                        if(birthMonth > monthNow || (birthMonth === monthNow && birthDay > dayNow)) {
                            let date1 = new Date(`${birthMonth}/${birthDay}/${yearNow}`), date2 = new Date(`${monthNow}/${dayNow}/${yearNow}`);
                            // Calculating Difference Between Today & Birthday
                            let diff = ( Math.abs(date2.getTime() - date1.getTime()) ) / (1000 * 3600 * 24)
                            convo.say(`There are ${diff} days left until your next birthday`);
                        }
                        else if(birthMonth === monthNow && birthDay === dayNow) { convo.say(`Congrats! Today is your Birth-Day`); }
                        else {
                            let date1 = new Date(`${birthMonth}/${birthDay}/${yearNow + 1}`), date2 = new Date(`${monthNow}/${dayNow}/${yearNow}`);
                            // Calculating Difference Between Today & Birthday
                            let diff = ( Math.abs(date2.getTime() - date1.getTime()) ) / (1000 * 3600 * 24);
                            convo.say(`There are ${diff} days left until your next birthday`);
                        }
                    } else if(result2 !== -1) { convo.say(`Goodbye 👋`); }
                    convo.end();
                });
            };
            chat.conversation((convo) => { askName(convo); });
        } catch (e) { res.json({success: false}); }
    });    
}

function storeExtraMessages (payload, chat) {
    chat.getUserProfile().then( async (user) => {
        try {
            const text = payload.message.text;
            // If The Text/Chat From User Isn't Undefined Then Store In Database
            if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
        } catch (e) { res.json({success: false}); }
    });   
}

module.exports = { conversation, storeExtraMessages }
