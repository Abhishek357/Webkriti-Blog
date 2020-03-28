const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");

const mySqlConnection = require(path.dirname(__dirname)+"/database/db.js");


router.get('/', (req, res)=>{
    if(req.session.user)
        res.send("<script>window.location.href = \"/\";alert(\"You are already logged In, You first need to logout\");</script>");
    else
        res.sendFile(path.dirname(__dirname)+"/html/SignUp.html");
});

var storage = multer.diskStorage(
    {
        destination: path.dirname(__dirname)+'/public/uploads',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, Date.now() + '-' + file.originalname);
        }
    }
);

const upload = multer({storage: storage});

var email_taken="<script>alert(\"Email already Taken\")</script>";
var user_taken="<script>alert(\"Email already Taken\")</script>";

router.post("/register", upload.single("myfile"), (req,res)=>{
    // console.log(req.file.filename);
    console.log(req.body);
    
    var f_name=req.body.firstName;
    var l_name=req.body.lastName;
    var u_name=req.body.userName;
    var email=req.body.email;
    var gender=req.body.gender;
    var p_pic=req.file.filename;
    var pass=req.body.password;
    
    mySqlConnection.query("select * from users where user_name = \""+u_name+"\";",(err,rows)=>{
        if(err)
            console.log("username matching error\n"+err);
        else
        if(rows.length){
            res.write(user_taken);
            res.send();
            // res.redirect("/signup");
        }else{
            mySqlConnection.query("select * from users where email = \""+email+"\";",(err,rows)=>{
                if(err)
                    console.log("email matching error\n"+err);
                else
                if(rows.length){
                    res.write(email_taken);
                    res.send();
                    // res.redirect("/signup");
                }else{
                    const hash=bcrypt.hashSync(pass,Number(process.env.SALT_ROUND));
                    var sql = "INSERT INTO users (f_name, l_name, user_name, email, pass, gender, photo) VALUES ("+"\""+f_name+"\",\""+l_name+"\",\""+u_name+"\",\""+email+"\",\""+hash+"\",\""+gender+"\",\""+p_pic+"\");";
                    mySqlConnection.query(sql,(err,rows)=>{
                        if(err) console.log(err);
                        else{
                            req.session.user=u_name;
                            console.log("Inserted");
                            res.redirect("/");
                        }
                    });
                }
            })
        }
    })
});

module.exports = router;