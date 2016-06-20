//main file for api calls

//importing the necessary modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var md5 = require("md5");

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

//Cross origin scripting access
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});


var port = process.env.PORT || 8085;

//basic objects formats
var register = {
  "username": "user name of the user",
  "email": "email of the user",
  "password": "password of the user"
};

var login = {
  "username": "user name of the user",
  "password": "password of the user"
}

var logout = {
  "username": "user name of the user",
  "token": "authentication token"
}


//Router for the app
var router = express.Router();


//loggin the requests
router.use(function(req, res, next){
  console.log("Request Received: " + (new Date()));
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Read Documentaion for API Usage' });
});


// ### Registration of a user
router.route("/accounts/register")
  .post(function(req, res){
    if(!req.body.username || !req.body.email || !req.body.password){
      //request format checking
      res.json(400, {"message": "Request Format Error", "required": register});
    }
    else{
      var data = {"username":req.body.username, "password": md5(req.body.password), "email": req.body.email, "active": 1};
      var registerQuery = "INSERT INTO users SET ?";
      con.query(registerQuery, data, function(err, data){
        if(err){
          var response = {
            "message": "Cannot Create User, Check Credentials",
            "error": err
          };
          res.json(400, response);
        }
        else {
          res.json(201, {"message": "Successfully Created User"});
        }
      });
    }

  });

// ### logging In A User
router.route("/accounts/login")
  .post(function (req, res){
    if(!req.body.username || !req.body.password){
      res.json(400, {"message": "Request Format Error", "required": login});
    }
    else{
      var data = [req.body.username, md5(req.body.password)];
      var loginQuery = "SELECT * FROM users WHERE user_id = ? AND password = ?";
      con.query(loginQuery, data, function(err, data){
        if(err){
          var response = {
            "message": "Cannot Login User, Check Credentials",
            "error": err
          };
          res.json(400, response);
        }
        else{
          //generate a token
          var token = md5((new Date()) + req.body.password);

          var saveToken = "INSERT INTO session SET ?";
          con.query(saveToken, {"username": req.body.username, "token": token});
          res.set("TOKEN", token);
          res.json(200, {"message": "Successfully Aurthorized"});
        }
      });
    }
  });


  //loggin out a user

router.route("/accounts/logout")
  .post(function (req, res){
    if(!req.body.username || !req.body.token){
      res.json(400, {"message": "Request Format Error", "required": logout});
    }
    else{
      var logoutQuery = "UPDATE session SET ? WHERE username = ? AND token = ?"
      con.query(logoutQuery, [{"token": "-1"}, req.body.username, req.body.token], function(err, data){
        if(err){
          var response = {
            "message": "Cannot Logout User, Check Credentials",
            "error": err
          };
          res.json(400, response);
        }
        else{
          res.json(200, {"message": "Successfully Logged Out"});
        }
      });

    }
  });
//all the endpoints will be prefixed with /api/
app.use("/api", router);

app.listen(port);
console.log("Sever running on http://localhost:" + port);
