//importing the necessary modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var md5 = require("md5");
var fs = require("fs");
var mv = require("node-mv");
var fileUpload = require("express-fileupload");
var path = require("path");
var sha = require("sha256");

var variables = require("./formatVariables");

module.exports = function(app, router, authenticate, con){
  // ### Adding categories and listing categories
  router.route("/blogs/categories")
    .post(authenticate, function(req, res){
      if(!req.body.category_name || !req.body.category_details){
        res.status(400).json({"message": "Request Format Error", "required": variables.category});
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
    .get(authenticate, function(req, res){
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

  // ### Adding and listing all the blogs
  //permissions, different responses and filters for different roles
  router.route("/blogs")
    .post(authenticate, function(req, res){
      if(!req.body.blog_title || !req.body.blog_body || !req.body.category_id || !req.body.user_id){
        res.status(400).json({"message": "Request Format Error", "required": variables.blog});
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
            var response = {
              "blog_id": data.insertId
            };
            res.status(201).json(response);
          }
        });
      }
    })
    .get(authenticate, function(req, res){
      //allowed filter => user_id, published, category_id
      var getBlogs = "";
      var selectParams = [];
      if(req.userRole == "user"){
        selectParams = " blogs.blog_id, users.user_id, users.username, users.email, blogs.blog_body, blogs.blog_title, blog_images.image_title, blog_images.image_path, blogs.creation_date, categories.category_id, categories.category_name, categories.category_details ";
        getBlogs = "SELECT" + selectParams + " FROM blogs LEFT OUTER JOIN blog_images on blogs.blog_id = blog_images.blog_id INNER JOIN users on blogs.user_id = users.user_id INNER JOIN categories ON categories.category_id = blogs.category_id WHERE blogs.published=1 AND ";

      }
      else if(req.userRole == "admin"){
        selectParams = " blogs.blog_id, users.user_id, users.username, users.email, users.active, blogs.blog_body, blogs.blog_title, blogs.published, blog_images.image_title, blog_images.image_path, blogs.creation_date, categories.category_id, categories.category_name, categories.category_details ";
        getBlogs = "SELECT" + selectParams + " FROM blogs LEFT OUTER JOIN blog_images on blogs.blog_id = blog_images.blog_id INNER JOIN users on blogs.user_id = users.user_id INNER JOIN categories ON categories.category_id = blogs.category_id WHERE 1 AND ";

      }

      //building the filter query
      if(Object.keys(req.query).length > 0){
        // getBlogs = getBlogs + " WHERE ";
        for(var key in req.query){
          var filter = "";
          if(key == 'user_id'){
            filter  = " users.user_id=" + req.query[key] + " AND ";
          }
          else if(key == "published" && req.userRole == "admin"){
            filter = " blogs.published=" + req.query[key] + " AND ";
          }
          else if(key == "category_id"){
            filter = " categories.category_id=" + req.query[key] + " AND ";
          }
          getBlogs = getBlogs + filter;
        }

      }
      getBlogs = getBlogs + "1";
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

  // ### Getting the details of a blog
  // A normal user cannot get an unpublished blog
  router.route("/blogs/:blog_id")
    .get(authenticate, function(req, res){
      var blog_id = req.params.blog_id;
      var getBlogDetails = "";
      selectParams = "";
      if(req.userRole == "user"){
        selectParams = " users.user_id, users.username, users.email, blogs.blog_id, blogs.blog_title, blogs.blog_body, categories.category_id, categories.category_name, categories.category_details, blog_images.image_title, blog_images.image_path ";
        getBlogDetails = "SELECT" + selectParams + " FROM users INNER JOIN blogs ON users.user_id = blogs.user_id INNER JOIN categories ON blogs.category_id = categories.category_id INNER JOIN blog_images ON blogs.blog_id = blog_images.blog_id WHERE blogs.blog_id = ? AND blogs.published=1";
      }
      else{
        selectParams = " users.user_id, users.username, users.email, users.active, users.role, blogs.creation_date, blogs.published, blogs.blog_id, blogs.blog_title, blogs.blog_body, categories.category_id, categories.category_name, categories.category_details, blog_images.image_title, blog_images.image_path ";
        getBlogDetails = "SELECT " + selectParams  + " FROM users INNER JOIN blogs ON users.user_id = blogs.user_id INNER JOIN categories ON blogs.category_id = categories.category_id INNER JOIN blog_images ON blogs.blog_id = blog_images.blog_id WHERE blogs.blog_id = ?";
      }
      var parameters = [blog_id];
      con.query(getBlogDetails, parameters, function(err, data){
        if(err){
          var response = {
            "message": "Cannot get blog details",
            "error": err
          };
          res.status(400).json(response);
        }
        else{
          if(data.length == 0){
            var response = {
              "message" : "No blogs with this id"
            };
            res.status(200).json(response);
          }
          else{
            res.status(200).json(data[0]);
          }
        }
      });
    });

  router.route("/blogs/images")
    .post(authenticate, function(req, res){
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
          //  console.log(blog_id);
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

  // ### Publishing and Depublishing a blog
  router.route("/blogs/publish/:blog_id")
    .post(authenticate, function(req, res){
      if(req.userRole == "user"){
        res.status(400).json({"message": "Not Aurthorized for this request!"});
        return;
      }

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
    .post(authenticate, function(req, res){
      if(req.userRole == "user"){
        req.status(400).json({"message": "Not Aurthorized for this Request"});
        return;
      }

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

// Liking and Disliking a blog pot
  router.route("/blogs/like/:blog_id")
    .get(authenticate, function(req, res){
      var blog_id = req.params.blog_id;
      var user_id = req.userId;
      var showLikes = "";
      if(req.userRole == "user"){
        showLikes = "SELECT users.user_id, username, email FROM users INNER JOIN likes ON users.user_id = likes.user_id WHERE blog_id = ?";
      }
      if(req.userRole == "admin"){
        showLikes = "SELECT users.user_id, username, email FROM users INNER JOIN likes ON users.user_id = likes.user_id WHERE blog_id = ?";
      }

      var parameters = [blog_id];

      con.query(showLikes, parameters, function(err, data){
        if(err){
          res.status(400).json(err);
          return;
        }

        res.status(200).json(data);

      });
    })
    .post(authenticate, function(req, res){
      var blog_id = req.params.blog_id;
      var user_id = req.userId;
      var addLike = "INSERT INTO likes SET ?";
      var parameters = [{"user_id": user_id, "blog_id": blog_id, "liked": 1}];
      console.log(parameters);
      con.query(addLike, parameters, function(err, data){
        if(err){
          res.status(400).json(err);
          return;
        }

        var response = {
          "message": "Successfully liked the blog"
        };
        res.status(201).json(response);

      });
    })

    .delete(authenticate, function(req, res){
      var blog_id = req.params.blog_id;
      var user_id = req.userId;
      var removeLike = "UPDATE likes SET ? WHERE user_id = ? AND blog_id = ?";
      var parameters = [{"liked": 0}, user_id, blog_id];
      console.log(parameters);
      con.query(removeLike, parameters, function(err, data){
        if(err){
          var response = {
            "message": "Cannot remove like",
            "error": err
          };
          res.status(400).json(response);
          return;
        }

        var response = {
          "message": "Successfully Removed Like"
        };
        console.log(data);
        res.status(200).json(response);

      });
    });

  router.route("/blogs/comment/:blog_id")
    .get(authenticate, function(req, res){
      var blog_id = req.params.blog_id;
      var user_id = req.userId;
      var showComments = "";
      if(req.userRole == "user"){
        showLikes = "SELECT users.user_id, username, email, comment_id, comment FROM users INNER JOIN comments ON users.user_id = comments.user_id WHERE blog_id = ?";
      }
      if(req.userRole == "admin"){
        showLikes = "SELECT users.user_id, username, email, comment_id, comment FROM users INNER JOIN comments ON users.user_id = comments.user_id WHERE blog_id = ?";
      }

      var parameters = [blog_id];

      con.query(showLikes, parameters, function(err, data){
        if(err){
          res.status(400).json(err);
          return;
        }

        res.status(200).json(data);

      });
    })
    .post(authenticate, function(req, res){
      if(!req.body.comment){
        var response = {
          "message": "Request Format Error",
          "required": {
            "comment": "comment of the user"
          }
        };
        res.status(400).json(response);
        return;
      }
      var blog_id = req.params.blog_id;
      var user_id = req.userId;
      var addLike = "INSERT INTO comments SET ?";
      var parameters = [{"user_id": user_id, "blog_id": blog_id, "comment": req.body.comment}];
      console.log(parameters);
      con.query(addLike, parameters, function(err, data){
        if(err){
          res.status(400).json(err);
          return;
        }

        var response = {
          "message": "Successfully added Comment on the blog"
        };
        res.status(201).json(response);

      });
    })

    .delete(authenticate, function(req, res){
      if(!req.body.comment_id){
        var response = {
          "message": "Request Format Error",
          "required": {
            "comment_id": "id of the comment"
          }
        };

        res.status(400).json(response);
        return;
      }
      var blog_id = req.params.blog_id;
      var user_id = req.userId;
      var removeLike = "DELETE FROM comments WHERE comment_id = ?";
      var parameters = [req.body.comment_id];
      console.log(parameters);
      con.query(removeLike, parameters, function(err, data){
        if(err){
          var response = {
            "message": "Cannot remove comment",
            "error": err
          };
          res.status(400).json(response);
          return;
        }

        var response = {
          "message": "Successfully Removed Comment"
        };
        res.status(200).json(response);

      });
    });

}
