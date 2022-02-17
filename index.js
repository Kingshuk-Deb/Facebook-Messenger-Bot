require('dotenv').config();

const express = require('express');
const BootBot = require('bootbot');
const config = require('config');

const { onLoadConnect } = require('./controllers/onLoad');
const { conversation, storeExtraMessages } = require('./controllers/conversations');

const messageRoutes = require('./routes/Messages');
const summaryRoutes = require('./routes/Summary');

const app = express();

onLoadConnect();

app.get('/', (req, res) => { res.redirect('https://www.facebook.com/Life-By-Ronnie-526292727787211'); });
app.use('/messages', messageRoutes);
app.use('/summary', summaryRoutes);
app.listen(process.env.PORT, (err) => { if(err) console.log(err); else console.log('Listeing!'); });

const bot = new BootBot({ accessToken: config.get('accessToken'), verifyToken: config.get('verifyToken'), appSecret: config.get('appSecret') });

bot.setGetStartedButton(async (payload, chat) => { conversation(chat); });
bot.hear('Start',async (payload, chat) => { conversation(chat); });
bot.on('message', (payload, chat) => { storeExtraMessages(payload, chat); });
bot.start(config.get('botPort'));