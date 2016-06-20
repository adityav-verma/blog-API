//main file for api calls

//importing the necessary modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");

//app instance
var app = express();

//mysql connection object
var con = mysql.createConnection({
  "host": "localhost",
  "user": "root",
  "password": "root",
  "database": "blog"
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//cross origin scripting access
app.use(function(){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST< GET, PUT, DELETE");
});


var port = process.env.PORT || 8085;

//Router for the app
var router = express.Router();

//loggin the requests

router.use(function(req, res, next){
  console.log("Request Received: " + (new Date()));
  next();
});


//all the endpoints will be prefixed with /api/
app.use("/api", router);

app.listen(port);
console.log("Sever running on http://localhost:" + port);
