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
      if(req.userRole == "user"){
        getBlogs = "SELECT * FROM blogs LEFT OUTER JOIN blog_images on blogs.blog_id = blog_images.blog_id INNER JOIN users on blogs.user_id = users.user_id INNER JOIN categories ON categories.category_id = blogs.category_id WHERE blogs.published=1 AND ";
      }
      else if(req.userRole == "admin"){
        getBlogs = "SELECT * FROM blogs LEFT OUTER JOIN blog_images on blogs.blog_id = blog_images.blog_id INNER JOIN users on blogs.user_id = users.user_id INNER JOIN categories ON categories.category_id = blogs.category_id WHERE 1 AND ";
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
      if(req.userRole == "user"){
        getBlogDetails = "SELECT * FROM users INNER JOIN blogs ON users.user_id = blogs.user_id INNER JOIN categories ON blogs.category_id = categories.category_id INNER JOIN blog_images ON blogs.blog_id = blog_images.blog_id WHERE blogs.blog_id = ? AND blogs.published=1";
      }
      else{
        getBlogDetails = "SELECT * FROM users INNER JOIN blogs ON users.user_id = blogs.user_id INNER JOIN categories ON blogs.category_id = categories.category_id INNER JOIN blog_images ON blogs.blog_id = blog_images.blog_id WHERE blogs.blog_id = ?";
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

}
