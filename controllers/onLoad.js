require('dotenv').config(); // Get All .env Variables
const mongoose = require('mongoose');

// Function To Create The MongoDB Atlas Connection
const onLoadConnect = () => {
    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vb4nv.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
    const connection = mongoose.connection;
    connection.once("open", (err) => { 
        if(err) console.log(err)
        else console.log("MongoDB database connection established successfully."); 
    });
}

const validate = ["yes", "yeah", "yup", "ya", "y"]; // Modern Synonym For Yes
const negate = ["no", "nah", "nop", "n"]; // Modern Synonym For No
const sayHi = 'Hi'; // Initial Message
const options = { typing: true }; // Mimics User Typing

module.exports = { onLoadConnect, validate, negate, sayHi, options }
