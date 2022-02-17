# Facebook Messenger Bot

# Working :

- Says Hi on entering the Chat.
- Asks for your name.
- Asks for your birth date.
- Asks if the user wants to find out how many days till his next birthday. [The bot accepts ("yes", "yeah", "yup", "no”, "nah", etc) as replies]
- The REST endpoints are /messages, /messages/:id, /summary, respectively

# DEMO VIDEO
<a href="https://youtu.be/pMHDWzZmZNE" title="AdaKerja Assignment Video Demo">
  <p align="center">
    <img width="100%" src="https://img.youtube.com/vi/pMHDWzZmZNE/maxresdefault.jpg" alt="AdaKerja Assignment Video Demo"/>
  </p>
</a>

# GIF SNIPPETS

## Click on Get Started
![Start](./gifs/start.gif)
![Get Started](./gifs/get_Started.gif)
## Provide Your Name
![name](./gifs/name.gif)
## Provide Your Birth Date
![date](./gifs/date.gif)
## Answer with a negetion/validation
![yup](./gifs/yup.gif)
![works](./gifs/works.gif)
## REST API Endpoint for all messages
![messages](./gifs/messages.gif)
## REST API Endpoint for a particular messages
![messages id](./gifs/messages_id.gif)
## REST API Endpoint for all user data
![Summary](./gifs/Summary.gif)

Made with [BootBot CLI](https://github.com/Charca/bootbot-cli)

# Runnig on Local Machine

```
sudo npm i bootbot-cli
```

```
npm install
```

```
npm start
```

# Packages & Tech Used :

- Bootbot
- Express
- Mongoose
- Shortid

```
Before starting initialise your env values in .env & bootbot config variables in config/default.json file
```

```javascript
// Initialise .env
MONGO_USERNAME=YOUR_MONGO_USERNAME
MONGO_PASSWORD=YOUR_MONGO_PASSWORD
MONGO_DBNAME=YOUR_MONGO_DBNAME
PORT=YOUR_PORT
```

```javascript
// Initialise config/default.json For BootBot Variables
{
  "accessToken": "YOUR_FACEBOOK_PAGE_ACCESS_TOKEN",
  "verifyToken": "YOUR_FACEBOOK_PAGE_VERIFY_TOKEN",
  "appSecret": "YOUR_FACEBOOK_APP_SECRET",
  "botPort": "YOUR_BOT_PORT", // Withut "" Integer
  "botTunnelSubDomain": "YOUR_BOT_LOCALTUNNEL_DOMAIN_NAME"
} 
```

```
It currently runs locally only as the Facebook App is not yet published
```
