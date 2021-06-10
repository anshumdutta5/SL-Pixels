const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
 app = express();
const bodyParser = require("body-parser");
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
var moment = require('moment');
const multer = require('multer');
const upload = multer({
  dest: 'public/uploads/'
});

require('dotenv').config();

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const loginRoute = require("./routes/login");
const previewRoute = require("./routes/preview");
const formRoute = require("./routes/form");



var flag = 1;

var preview_type = 0;

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};


const { verifyUser } = require("./middlewares/verifyUser");

app.use("/",loginRoute);
app.use("/preview",previewRoute);
app.use("/form",formRoute);



app.get("/logout",function(req,res){
  res.cookie("jwt", " ", {
    expires: new Date(Date.now() + 1),
    httpOnly: true
  });
  res.redirect("/");
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
})
