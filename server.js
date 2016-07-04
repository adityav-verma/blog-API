//main file for api calls

//importing the necessary modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var fs = require("fs");
var fileUpload = require("express-fileupload");

//app instance
var app = express();

app.use(fileUpload());
app.use(express.static("."));

//mysql connection object
var data = fs.readFileSync("./config.json");
var mysqlConfig = JSON.parse(data).mysql;
var expressConfig = JSON.parse(data).express;
//console.log(mysqlData);

//Added Connection Pooling
var con = mysql.createPool({
	"connectionLimit": 100,
	"host": mysqlConfig.host,
	"user": mysqlConfig.user,
	"password": mysqlConfig.password,
	"database": "blog"
});

//middleware for body parser - helps in getting req.body variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Cross origin scripting access
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	next();
});


var port = process.env.PORT || expressConfig.port;

//Router for the app
var router = express.Router();

//Authentication Middleware, for authenticating the user - also checks for token format errors
//if user is authenticated, userRole = user or userRole = admin, based on their roles
function authenticate(req, res, next){

	if(!req.get("token")){
		var response = {
			"message": "request format error",
			"required": "Send authentication Token in the Header"
		};
		res.status(400).json(response);
		return;
	}

	var token = req.get("token");
	var auth = "SELECT * from users INNER JOIN session ON users.username = session.username WHERE token = ?";
	var parameters = [token];
	con.query(auth, parameters, function(err, data){
		if(err){
			var response = {
				"message": "Authentication Error",
				"err": err
			};
			res.status(400).json(response);
			return;
		}
		else{
			if(data.length == 0){         //no user with this token is loggedIn
				var response2 = {
					"message": "No user with this token!"
				};
				res.status(400).json(response2);
				return;
			}
			else{
//  console.log(data);
				if(data[0].role == "admin"){
					req.userRole = "admin";
					req.userId = data[0].user_id;
				}
				else{
					req.userRole = "user";
					req.userId = data[0].user_id;
				}

//res.json({"role": req.userRole});
				return next();
			}
		}
	});
}

//loggin the requests
router.use(function(req, res, next){
	console.log("Request Received: " + (new Date()));
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get("/", function(req, res) {
	res.json({ message: "Read Documentaion for API Usage" });
});

// ### Adding accounts routes
require("./routes/accountsRoutes")(app, router, authenticate, con);

require("./routes/blogRoutes")(app, router, authenticate, con);

//all the endpoints will be prefixed with /api/
app.use("/api", router);

app.listen(port);
console.log("Sever running on http://localhost:" + port);
