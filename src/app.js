require('dotenv').config();

//modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routes
const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profile');

//DB connection
mongoose.connect(`mongodb://127.0.0.1/${process.env.DB_NAME}`).then(()=>{
    console.log('Sucessfully: DB connected');
}).catch(()=>{
    console.log('Error: DB was not connected');
});

//express
const app = express();

app.use('/', bodyParser.json());
app.use('/', bodyParser.urlencoded({extended: false}));
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

//server
app.listen(process.env.PORT, ()=>{
    console.log(`Sucessfully: Server open on PORT ${process.env.PORT}`);
})