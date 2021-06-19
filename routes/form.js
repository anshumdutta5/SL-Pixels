
const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
// const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
var moment = require('moment');
const multer = require('multer');
const upload = multer({
  dest: '../public/uploads/'
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

var flag = 1;
var image = " ";
var date;
const KEY = "12345678";
var count = 0;

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};

router.get("/",verifyUser, function(req, res) {
  var preview_type = app.get("preview_type");
  if(!preview_type){
    res.redirect("/preview");
  }else{
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
      image = " ";
  }

});

router.post("/",verifyUser,upload.single('img'), function(req, res) {
  var key = req.body.key;
  var url_user = req.body.url;
  var id = req.body.id;
  var pswd = req.body.password;
  if(req.file){
    var path = req.file.path;
  }

  var url;

  var preview_type = app.get("preview_type");
  if (key === KEY) {
    switch (preview_type) {
      case "1":
      if(url_user){
        url = url_user;
      }else{
        url = path;
      }
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
        if(url_user){
          url = url_user;
        }else{
          url = path;
        }
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
          if(url_user){
            url = url_user;
          }else{
            url = path;
          }
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

module.exports = router;
