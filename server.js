//main file for api calls

//importing the necessary modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var md5 = require("md5");
var fs = require("fs");
var mv = require("node-mv");
var fileUpload = require("express-fileupload");
var path = require("path");


//app instance
var app = express();

app.use(fileUpload());
app.use(express.static('.'));

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

var blog = {
  "token": "token of the loggedIn user",
  "user_id": "user id for the logged in user",
  "category_id": "id of the category",
  "blog_title": "title",
  "blog_body": "body of the blog"
};

var category = {
  "category_name": "Name of the category",
  "category_details": "Details of the category"
};

//Router for the app
var router = express.Router();

//checks a valid token, returns -1 for invalid, 0 for normal user, 1 for admin
function isAdmin(token, callback){
  console.log(token);
  var checkAdmin = "SELECT * FROM users INNER JOIN session on users.user_id = session.session_id WHERE token = ?";
  var parameters = [token];
  con.query(checkAdmin, parameters, function(err, data){
    if(err){
      callback(-1);
    }
    else{
      if(data.length == 0){
        console.log("inside data length 0");
        callback(-1);
      }
      else{
        if(data.role == "admin")
          callback(1);
        else
          callback(0);
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
router.get('/', function(req, res) {
    res.json({ message: 'Read Documentaion for API Usage' });
});




// ### Registration of a user
router.route("/accounts/register")
  .post(function(req, res){
    if(!req.body.username || !req.body.email || !req.body.password){
      //request format checking
      res.status(400).json({"message": "Request Format Error", "required": register});
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
          res.status(400).json(response);
        }
        else {
          res.status(201).json({"message": "Successfully Created User"});
        }
      });
    }

  });
router.route("/accounts/deactivate/:user_id")
  .delete(function(req, res){
    var user_id = req.params.user_id;
    var deactivateUser = "UPDATE users SET active = 0 WHERE user_id = ?";
    var parameters = [user_id];
    con.query(deactivateUser, parameters, function(err, data){
      if(err){
        var response = {
          "message": "Cannot deactivate user",
          "error": err
        };
        res.status(400).json(response);
      }
      else{
        // TODO: Add checks whether a removed user already existed
        var response = {
          "message": "User removed"
        };
        res.status(200).json(response);
      }
    });
  });


  router.route("/accounts/deactivate/")
    .delete(function(req, res){
      var user_id = req.query.user_id;
      var deactivateUser = "UPDATE users SET active = 0 WHERE user_id = ?";
      var parameters = [user_id];
      con.query(deactivateUser, parameters, function(err, data){
        if(err){
          var response = {
            "message": "Cannot deactivate user",
            "error": err
          };
          res.status(400).json(response);
        }
        else{
          // TODO: Add checks whether a removed user already existed
          var response = {
            "message": "User removed"
          };
          res.status(200).json(response);
        }
      });
    });

router.route("/accounts/activate/:user_id")
  .post(function(req, res){
    var user_id = req.params.user_id;
    var deactivateUser = "UPDATE users SET active = 1 WHERE user_id = ?";
    var parameters = [user_id];
    con.query(deactivateUser, parameters, function(err, data){
      if(err){
        var response = {
          "message": "Cannot activate user",
          "error": err
        };
        res.status(400).json(response);
      }
      else{
        // TODO: Add checks whether a removed user already existed
        var response = {
          "message": "User Activted"
        };
        res.status(200).json(response);
      }
    });
});

router.route("/accounts/activate/")
  .post(function(req, res){
    var user_id = req.query.user_id;
    var deactivateUser = "UPDATE users SET active = 1 WHERE user_id = ?";
    var parameters = [user_id];
    con.query(deactivateUser, parameters, function(err, data){
      if(err){
        var response = {
          "message": "Cannot activate user",
          "error": err
        };
        res.status(400).json(response);
      }
      else{
        // TODO: Add checks whether a removed user already existed
        var response = {
          "message": "User Activted"
        };
        res.status(200).json(response);
      }
    });
});
// ### logging In A User
router.route("/accounts/login")
  .post(function (req, res){
    if(!req.body.username || !req.body.password){
      res.status(400).json({"message": "Request Format Error", "required": login});
    }
    else{
      var data = [req.body.username, md5(req.body.password)];
      var loginQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
      con.query(loginQuery, data, function(err, data){
        if(err){
          var response = {
            "message": "Cannot Login User, Check Credentials",
            "error": err
          };
          res.status(400).json(response);
        }
        else{
          //generate a token
           if(data.length == 0){
             res.status(400).json({"message": "No user with this username", "Data":data});
           }
           else{
            var token = md5((new Date()) + req.body.password);

            var saveToken = "INSERT INTO session SET ?";
            con.query(saveToken, {"username": req.body.username, "token": token});
            //res.set("TOKEN", token);
            res.status(200).json({"message": "Successfully Aurthorized", "token": token, "data": data});
          }
        }
      });
    }
  });


  //loggin out a user

router.route("/accounts/logout")
  .post(function (req, res){
    if(!req.body.username || !req.body.token){
      res.status(400).json({"message": "Request Format Error", "required": logout});
    }
    else{
      var logoutQuery = "UPDATE session SET ? WHERE username = ? AND token = ?"
      con.query(logoutQuery, [{"token": "-1"}, req.body.username, req.body.token], function(err, data){
        if(err){
          var response = {
            "message": "Cannot Logout User, Check Credentials",
            "error": err
          };
          res.status(400).json(response);
        }
        else{
          res.status(200).json({"message": "Successfully Logged Out", "data": data});
        }
      });

    }
  });

router.route("/accounts/users")
  .get(function(req, res){
    var allUsers = "SELECT user_id, username, email, active, role, time_of_registration FROM users";
    con.query(allUsers, function(err, data){
      if(err){
        var response = {
          "message": "Cannot list users",
          "error": err
        };
        res.status(400).json(response);
      }
      else{
        res.status(200).json(data);
      }
    });

  });

//tesign routes
router.route("/test/")
  .post(function(req, res){
    var value = isAdmin(req.body.token, function(data){
      console.log(data);
      res.json({"value": data});
    });
  });

// ### Adding categories
router.route("/blogs/categories")
  .post(function(req, res){
    if(!req.body.category_name || !req.body.category_details){
      res.status(400).json({"message": "Request Format Error", "required": category});
    }
    else{
      var data = {"category_name": req.body.category_name, "category_details": req.body.category_details};
      var addCategory = "INSERT INTO categories SET ?";
      con.query(addCategory, data, function(err, data){
        if(err){
          var response = {
            "message": "Cannot add category",
            "error": err
          };
          res.status(400).json(response);
        }
        else{
          res.status(201).json({"message": "Created Category Successfully"});
        }
      });
    }
  })
  .get(function(req, res){
    var allCategories = "SELECT * FROM categories";
    con.query(allCategories, function(err, data){
      if(err){
        var response = {
          "message": "Cannot show categories",
          "error": err
        }
        res.status(400).json(response);
      }
      else{
        res.status(200).json(data);
      }
    });
  });
// ##### ADDING NEW BLOGS ####
router.route("/blogs")
  .post(function(req, res){
    if(!req.body.blog_title || !req.body.blog_body || !req.body.category_id || !req.body.user_id){
      res.status(400).json({"message": "Request Format Error", "required": blog});
    }
    else{
      var addBlog = "INSERT INTO blogs SET ?";
      var data = {"blog_title": req.body.blog_title, "blog_body": req.body.blog_body, "category_id": req.body.category_id, "user_id": req.body.user_id};
      con.query(addBlog, data, function(err, data){
        if(err){
          var response = {
            "message": "Cannot add blog",
            "error": err
          };
          res.status(400).json(response);
        }
        else{
          var getBlog = "SELECT * FROM blogs WHERE user_id = ? ORDER BY blog_id DESC LIMIT 1";
          con.query(getBlog, [req.body.user_id], function(err, data){
            if(err){
              res.json(err);
            }
            else{
              res.json(data[0]);
            }
          });
        }
      });
    }
  })
  .get(function(req, res){
    //var getBlogs = "SELECT * FROM blogs INNER JOIN blogs_images on blogs.blog_id = blog_images.blog_id INNER JOIN users on blogs.user_id = users.user_id";
    var getBlogs = "SELECT * FROM blogs LEFT OUTER JOIN blog_images on blogs.blog_id = blog_images.blog_id INNER JOIN users on blogs.user_id = users.user_id INNER JOIN categories ON categories.category_id = blogs.category_id";
    con.query(getBlogs, function(err, data){
      if(err){
        var response = {
          "message": "Cannot show blogs",
          "errors": err
        };
        res.json(response);
      }
      else{
        res.json(data);
      }
    });
  });

router.route("/blogs/images")
  .post(function(req, res){
    var blogImage;
    if(!req.query.blog_id){
      res.status(400).json({"message": "Bad request!"});
      return;
    }
    var blog_id = req.query.blog_id;
    if(!req.files){
      var addDefaultImage = "INSERT INTO blog_images SET ?";
      var data = {"blog_id": req.query.blog_id, "image_title": "default", "image_path": "images/default.jpeg"};
      con.query(addDefaultImage, data, function(err, data){
        if(err){
          var response = {
            "message": "Cannot add default image",
            "error": err
          };
          res.json(response);
        }
        else{
          res.status(201).json({"message": "Added default image"});
        }
      });
    }
    else{
      var blogImage = req.files.blogImage;
      var extension = req.files.blogImage.name.split(".")[1];
      var image_title = md5(new Date());
      var url = "images/" +  image_title + "." + extension;
      blogImage.mv(url, function(err){
        if (err) {
    			res.status(500).send(err);
    		}
    		else {
          var addImage = "INSERT INTO blog_images SET ?";
          console.log(blog_id);
          var data = {"blog_id": blog_id, "image_title": image_title, "image_path": url};
          con.query(addImage, data, function(err, data){
            if(err){
              res.json(err);
            }
            else{
              res.json({"message": "Image uploaded", "path": url});
            }
          });
    		}
      });
    }
  })

//tesing API for image upload
router.route("/upload")
  .post(function(req, res){
    var sampleFile;

  	if (!req.files) {
  		res.send('No files were uploaded.');
  		return;
  	}
    console.log(req.files);
  	sampleFile = req.files.sampleFile;
    console.log(req.files.sampleFile);
    var extension = (req.files.sampleFile.name).split(".")[1];
    console.log(req.files.sampleFile.name);
    console.log(extension);
  	sampleFile.mv('upload/' + md5(new Date()) + "." + extension, function(err) {
  		if (err) {
  			res.status(500).send(err);
  		}
  		else {
  			res.send('File uploaded!');
  		}
  	});
  });

router.route("/blogs/publish/:blog_id")
  .post(function(req, res){
    var blog_id = req.params.blog_id;
    var publishBlog = "UPDATE blogs SET published = 1, published_date = NOW() WHERE blog_id = ?";
    var parameters = [blog_id];
    con.query(publishBlog, parameters, function(err, data){
      if(err){
        var response = {
          "message": "Cannot publish Blog",
          "error": err
        };

        res.status(400).json(response);
      }
      else{
        // TODO: Solve issue of server crashing when applying these conditions
        // if(data["affectedRows"] == 0){
        //   res.status(400).json({"message": "No blog with this blog id", "data": data});
        // }
        // else{
        //   res.satus(200).json({"message": "Blog Published", "data": data});
        // }
        res.json(data);
      }
    });
  });

router.route("/blogs/depublish/:blog_id")
  .post(function(req, res){
    var blog_id = req.params.blog_id;
    var publishBlog = "UPDATE blogs SET published = 0, published_date = NOW() WHERE blog_id = ?";
    var parameters = [blog_id];
    con.query(publishBlog, parameters, function(err, data){
      if(err){
        var response = {
          "message": "Cannot De publish Blog",
          "error": err
        };

        res.status(400).json(response);
      }
      else{
        // TODO: Solve issue of server crashing when applying these conditions
        // if(data["affectedRows"] == 0){
        //   res.status(400).json({"message": "No blog with this blog id", "data": data});
        // }
        // else{
        //   res.satus(200).json({"message": "Blog Published", "data": data});
        // }
        res.json(data);
      }
    });
  });
//all the endpoints will be prefixed with /api/
app.use("/api", router);

app.listen(port);
console.log("Sever running on http://localhost:" + port);
