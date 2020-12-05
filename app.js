//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")

console.log(md5("wakawaka"))

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({ 
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    }
});


//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req,res) => {
    res.render("home");
})

app.get("/login", (req,res) => {
    res.render("login");
})


app.get("/register", (req,res) => {
    res.render("register");
})

app.post("/register", (req,res) => {
    const user = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    user.save((error) =>{
        if(!error){
            res.render("secrets")
        }else{
            console.log(error)
        }
    })

})

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (error, user) =>{
        if(!error){
            if(user){
                if(user.password === password){
                    res.render("secrets");
                }
            }else{
                res.render("home");
            }
        }else{
            console.log(error);
        }
    })

});



app.listen(3000, ()=>{
    console.log("Server started on port 3000.")
});
