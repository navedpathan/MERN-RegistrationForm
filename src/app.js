const express = require('express');
const app = express();
const path = require("path");
const hbs = require("hbs"); 
const bcrypt = require("bcryptjs");

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// console.log(path.join(__dirname, "../public"))

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render('index')
})

app.get("/register", (req, res) => {
  res.render('register')
})

app.get("/login", (req, res) => {
  res.render('login')
})

// create a new user in our database
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if(password == cpassword) {
      const registerOwner = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        mobilenumber: req.body.mobilenumber,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword
      })

      const registered = await registerOwner.save();
      res.status(201).render('index');
    }
    else {
      res.send("password are not matching")
    }
  } catch (error) {
    res.status(400).send(error);
  }
})

// login check
app.post("/login", async(req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({email:email});

    const isMatch = await bcrypt.compare(password, userEmail.password);
    
    if(isMatch) {
      res.status(201).render("index");
    }
    else {
      res.send("invalid Password details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
})

// const bcrypt = require("bcryptjs");
// const securePassword = async (password) => {

//   const passwordHash = await bcrypt.hash(password, 10);
//   console.log(passwordHash);

//   const passwordMatch = await bcrypt.compare("naved@123", 10);
//   console.log(passwordMatch); 
// }
// securePassword("naved@123")

app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
})