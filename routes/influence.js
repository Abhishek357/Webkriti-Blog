const express = require('express');
const path = require("path");
const router = express.Router();

function loggedIn(){
    // return 1; - user logged in
    // return 0; - user logged out
}

router.get('/', (req, res)=>{
    // res.sendFile(path.dirname(__dirname)+"/html/homePage.html");
    res.render("influence.ejs",{});
});

module.exports = router;