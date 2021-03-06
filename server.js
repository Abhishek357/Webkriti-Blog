require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT=process.env.PORT || 3000;
// Now in .env file

app.use(session({
    secret: process.env.SESSION_PASS,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));  
// I commented below line because due to this when I render infuence.ejs through edit button its css was not working
// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// const a=require(__dirname+"/routes/influence.js");


app.use("/", require(__dirname+"/routes/home.js"));
app.use("/signup", require(__dirname+"/routes/signUp.js"));
app.use("/signin", require(__dirname+"/routes/signIn.js"));
app.use("/mycreation", require(__dirname+"/routes/myCreation.js"));
app.use("/influence", require(__dirname+"/routes/influence.js"));

app.listen(PORT, ()=>{
    console.log("Server Started at PORT "+PORT);
}); 