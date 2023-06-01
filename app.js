//jshint esversion:6
require('dotenv').config()
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app= express();

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
})); 

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true})
.then(()=>{
    console.log("Successfuly connected to MongoDB")
})
.catch(err =>{
    console.log(err)
});

const userSchema =  new mongoose.Schema({

    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema)


app.get("/", function(req,res){
    res.render("home")
});

app.get("/login", function(req,res){
    res.render("login")
})

app.get("/register", function(req,res){
    res.render("register")
})

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    .then(()=> {
        res.render("secrets")
    })

    .catch(err =>{
        console.log(err);
    })
})

app.post("/login", function(req,res){
    const userEmail = req.body.username
    const userPassword = req.body.password

    User.findOne({email:userEmail})
    .then((foundUser)=>{
        if (foundUser.password==userPassword) {
            res.render("secrets");
        } else {
            req.render("/login");
            
        }
    })
    .catch(err =>{
        res.render(err)
    })
})
app.listen(3000, function(){
    console.log("Server is running at port 3000")
});