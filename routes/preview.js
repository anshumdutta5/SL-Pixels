
const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
const router = express.Router();
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
const { verifyUser } = require("../middlewares/verifyUser");
require('dotenv').config();

router.use(cookieParser());

// router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(express.static("public"));

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};

router.get("/",verifyUser,function(req,res){
  let arr = [];
  pool.getConnection(function(err,conn){
    if(err){
      console.log(err);
    }else{
      conn.query("SELECT permitted_id FROM permission WHERE user_id=?",req.user.user_id1,function(err,rows){
        if(err){
          console.log(err);
        }else{
          rows.forEach(function(row){
            arr.push(row.permitted_id);
          })
          res.render("preview",{
            arr:arr
          });
        }
      })
    }
  })
})


router.post("/",verifyUser,function(req,res){
  preview_type = req.body.preview_type;
  app.set("preview_type",preview_type);
  res.redirect("/form");
})

module.exports = router;
