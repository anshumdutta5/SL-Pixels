const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
var moment = require('moment');

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


var image = " ";
var date;
const KEY = "12345678";
var flag = 1;
var count = 0;
var preview_type = 0;

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};

const generateAccessToken1 = (username) => {
  return cookieParser.JSONCookie(username);
};

const { verifyUser } = require("./middlewares/verifyUser");

app.get("/", function(req, res) {
  res.render("login");
})

app.get("/preview",verifyUser,function(req,res){
  res.render("preview");
})

app.get("/form",verifyUser, function(req, res) {
  if(preview_type === 0){
    res.redirect("/preview");
  }
  // preview_type = 0;
  if(flag === 0 && count === 1){
    flag = 1;
    count = 0;
  }else if (flag === 0 && count === 0) {
    count++;
  }
    res.render("form", {
      url: image,
      date: date,
      flag: flag,
    });
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
            const user_id1 = rows[0].id;
            const token = generateAccessToken({ username,user_id1 });
            res.cookie("jwt", token, {
              expires: new Date(Date.now() + 1000 * 60 * 60),
              httpOnly: true
            });
            res.redirect("/preview");
          }else{
            console.log("Not found");
            res.redirect("/");
          }
        }else{
          console.log("Not found");
          res.redirect("/");
        }
      })
      pool.releaseConnection(conn);
    }
  })
});

app.post("/preview",verifyUser,function(req,res){
  preview_type = req.body.preview_type;
  res.redirect("/form");
})


app.post("/form",verifyUser, function(req, res) {
  var key = req.body.key;
  var url = req.body.url;
  var id = req.body.id;
  var pswd = req.body.password;
  if (key === KEY) {
    switch (preview_type) {
      case "1":

       // console.log(req.user);


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
          var obj = {
            user_id : req.user.user_id1,
            date : date,
            url : image
          }
          var values = Object.values(obj);
          pool.getConnection(function(err,conn){
            if(err){
              console.log(err);
            }else{
              conn.query("INSERT INTO marketing_data (user_id,date,url) VALUES ?", [[values]],function(err){
                if(err){
                  console.log(err);
                }else{
                  console.log("Successfully inserted data");
                }
              })
              pool.releaseConnection(conn);
            }
          })
          // console.log(image);
          res.redirect("/form");
        })
        .catch(function(error) {
          console.log(error);
        });
        break;
        case "2":
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
            res.redirect("/form");
          })
          .catch(function(error) {
            console.log(error);
          });
          break;
          case "3":
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
              res.redirect("/form");
            })
            .catch(function(error) {
              console.log(error);
            });
            break;
      default:
        res.redirect("/preview");
    }

  } else {
    flag = 0;
    res.redirect("/form");
  }

});





app.listen(3000, function() {
  console.log("Server started on port 3000");
})
