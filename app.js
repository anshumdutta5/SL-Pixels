const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const md5 = require('md5');

require('dotenv').config();

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


var image = " ";
var date;
const KEY = "12345678";
var flag = 1;
var flag_login = 1;


app.get("/", function(req, res) {
  res.render("login",{
    flag_login:flag_login
  });
  flag_login = 1;
})

app.get("/form", function(req, res) {
  res.render("login");
});



app.post("/", function(req, res) {
  var username = req.body.username;
  var password = md5(req.body.password);

  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
    }else{
      conn.query("SELECT * FROM identities WHERE username=?", username, function(err, rows){

        if(rows.length>0){

          if(rows[0].password === password){
            console.log("User Found");

            res.render("form", {
              url: image,
              date: date,
              flag: flag
            });
            image = " ";
            flag = 1;
          }else{
            // alert("Invalid Password!!");
            console.log("Not found");
            flag_login = 0;
            res.redirect("/");
          }
        }else{
          // alert("Invalid Username!!");
          console.log("Not found");
          flag_login = 0;
          res.redirect("/");
        }
      })
    }
  })
});


app.post("/form", function(req, res) {
  var key = req.body.key;
  var url = req.body.url;
  var id = req.body.id;
  var pswd = req.body.password;


  if (key === KEY) {
    axios.post('https://studio.pixelixe.com/api/graphic/automation/v2', {
        template_name: "CS-Design3",
        api_key: "dd8SrZnkmnXbzcjjVu9lTUPJylA2",
        format: "json",
        modifications: [{
            name: "header-image",
            type: "image",
            image_url: "default",
            width: "1080px",
            height: "185px",
            visible: "true"
          },
          {
            name: "center-image",
            type: "image",
            image_url: "default",
            width: "1080px",
            height: "801px",
            visible: "true"
          },
          {
            name: "footer-image",
            type: "image",
            image_url: "default",
            width: "1080px",
            height: "97px",
            visible: "true"
          },
          {
            name: "client-logo-url",
            type: "image",
            image_url: url,
            width: "800px",
            height: "154px",
            visible: "true"
          },
          {
            name: "zoom-id-pass",
            type: "text",
            text: "Meeting id:" + id + " | Password:" + pswd,
            color: "black",
            "font-size": "37px",
            visible: "true"
          }
        ]
      })
      .then(function(response) {

        // console.log(response);
        image = response.data.image_url;
        date = response.data.created_at;
        // console.log(image);
        res.render("form", {
          url: image,
          date: date,
          flag: flag
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    flag = 0;
    res.render("form", {
      url: image,
      date: date,
      flag: flag
    });
  }

});





app.listen(3000, function() {
  console.log("Server started on port 3000");
})
