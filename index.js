require('dotenv').config()
const express = require('express');
const BootBot = require('bootbot');
const config = require('config');
const shortid = require('shortid');
const mongoose = require('mongoose');
const Messages = require('./messagesDB');
const Users = require('./usersDB');

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vb4nv.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;
const validate = ["yes", "yeah", "yup", "ya", "y"];
const negate = ["no", "nah", "nop", "n"];
const sayHi = 'Hi';
const options = { typing: true };

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
const connection = mongoose.connection;
connection.once("open", (err) => { 
    if(err) console.log(err)
    else console.log("MongoDB database connection established successfully."); 
});

app.get('/', (req, res) => { res.redirect('https://www.facebook.com/Life-By-Ronnie-526292727787211'); });

app.get('/messages', async (req, res) => {
    let msg = []; const messages = await Messages.find({}, { _id: 0 });
    messages.map((element) => { msg.push({ message: element.message, id: element.message_id  }) })
    res.json({messages: msg});
});

app.get('/messages/:id', async (req, res) => {
    const message = await Messages.find( { message_id: req.params.id }, { message: 1, _id: 0 });
    res.json({ message: message[0].message });
});

app.get('/summary', async (req, res) => {
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
});

app.listen(process.env.PORT, (err) => {
    if(err) console.log(err);
    else console.log('Listeing!');
});

const bot = new BootBot({
    accessToken: config.get('accessToken'),
    verifyToken: config.get('verifyToken'),
    appSecret: config.get('appSecret')
});

async function conversation (chat) {
    chat.getUserProfile().then( async (user) => {
        const userFlag = await Users.find({ user: parseInt(user.id) }, { user: 1, _id: 0 });
        await chat.say(sayHi, options);
        const askName = (convo) => {
            convo.ask(`What's your name?`, async (payload, convo) => {
                const text = payload.message.text;
                if(userFlag.length === 0) { const newUser = new Users({ user: parseInt(user.id), name: text }); await Users.create(newUser); } 
                if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
                convo.set('name', text);
                convo.say(`Oh, your name is ${text}`).then(() => askBirthDate(convo));
            });
        };
        const askBirthDate = (convo) => {
            convo.ask(`What's your birth date? [YYYY-MM-DD]`, async (payload, convo) => {
                const text = payload.message.text;
                if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
                convo.set('birthDate', text);
                convo.say(`Got it, your birth date is ${text}`).then(() => sendSummary(convo));
            });
        };
        const sendSummary = (convo) => { convo.say(`Ok, here's what you told me about you:${'\n'}- Name: ${convo.get('name')}${'\n'}- Birth Date: ${convo.get('birthDate')}`).then(() => askLast(convo)); };
        const askLast = (convo) => {
            convo.ask(`Do you want to know how many days left in your birth date?`, async (payload, convo) => {
                const text = payload.message.text;
                if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
                const result1 = validate.indexOf(text.toLowerCase()), result2 = negate.indexOf(text.toLowerCase());
                if(result1 !== -1) {
                    let birthDate = convo.get('birthDate'), birthMonth = parseInt(birthDate.substring(5,7)), birthDay = parseInt(birthDate.substring(8));
                    let dateNow = new Date(), yearNow = dateNow.getFullYear(), monthNow = dateNow.getMonth() + 1, dayNow = dateNow.getDate();
                    if(birthMonth > monthNow || (birthMonth === monthNow && birthDay > dayNow)) {
                        let date1 = new Date(`${birthMonth}/${birthDay}/${yearNow}`), date2 = new Date(`${monthNow}/${dayNow}/${yearNow}`);
                        let diff = ( Math.abs(date2.getTime() - date1.getTime()) ) / (1000 * 3600 * 24)
                        convo.say(`There are ${diff} days left until your next birthday`);
                    }
                    else if(birthMonth === monthNow && birthDay === dayNow) { convo.say(`Congrats! Today is your Birth-Day`); }
                    else {
                        let date1 = new Date(`${birthMonth}/${birthDay}/${yearNow + 1}`), date2 = new Date(`${monthNow}/${dayNow}/${yearNow}`);
                        let diff = ( Math.abs(date2.getTime() - date1.getTime()) ) / (1000 * 3600 * 24);
                        convo.say(`There are ${diff} days left until your next birthday`);
                    }
                } else if(result2 !== -1) { convo.say(`Goodbye 👋`); }
                convo.end();
            });
        };
        chat.conversation((convo) => { askName(convo); });
    });    
}

bot.setGetStartedButton(async (payload, chat) => { conversation(chat); });

bot.hear('Start',async (payload, chat) => { conversation(chat); });

bot.on('message', (payload, chat) => {
    chat.getUserProfile().then( async (user) => {
        const text = payload.message.text;
        if(text !== undefined) { const newMessage = new Messages({ user_id: parseInt(user.id), message_id: shortid.generate(), message: text }); await Messages.create(newMessage); }
    });   
});

bot.start(config.get('botPort'));