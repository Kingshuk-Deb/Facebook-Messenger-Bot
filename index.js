require('dotenv').config(); // Get All .env Variables

const express = require('express');
const BootBot = require('bootbot');
const config = require('config');

const { onLoadConnect } = require('./controllers/onLoad'); // Importing Mongo Connect
const { conversation, storeExtraMessages } = require('./controllers/conversations');

const messageRoutes = require('./routes/Messages'); // Route For Fetching Message Datas
const summaryRoutes = require('./routes/Summary'); // Route For fetching User Datas

const app = express(); // Initialise Express App

onLoadConnect(); // Initialise Mongo Connection

app.get('/', (req, res) => { res.redirect('https://www.facebook.com/Life-By-Ronnie-526292727787211'); }); // Home Route
app.use('/messages', messageRoutes);
app.use('/summary', summaryRoutes);
app.listen(process.env.PORT, (err) => { if(err) console.log(err); else console.log(`Listeing on PORT->${process.env.PORT}!`); });

// Initialise BootBot
const bot = new BootBot({ accessToken: config.get('accessToken'), verifyToken: config.get('verifyToken'), appSecret: config.get('appSecret') });

bot.setGetStartedButton(async (payload, chat) => { conversation(chat); }); // Starting The Conversation On Get Started Button
bot.hear('Start',async (payload, chat) => { conversation(chat); }); // Starting The Conversation On Typing 'Start'

bot.on('message', (payload, chat) => { storeExtraMessages(payload, chat); }); // Storing Extra Messages On Database
bot.start(config.get('botPort')); // Starting The Bot