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

// Error variable which give the proper format
var variables = require("./formatVariables");

module.exports = function(app, router, authenticate, con){
  // ### Registration of a user
  router.route("/accounts/register")
    .post(function(req, res){
      if(!req.body.username || !req.body.email || !req.body.password){
        //request format checking
        res.status(400).json({"message": "Request Format Error", "required": variables.register});
      }
      else{
        var data = {"username":req.body.username, "password": (md5(req.body.password)), "email": req.body.email, "active": 1};
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

  // ### Activating and Deactivating a user
  router.route("/accounts/deactivate/:user_id")
    .delete(authenticate, function(req, res){
      if(req.userRole == "user"){
        res.status(400).json({"message": "Not Aurthorized for this request"});
        return;
      }
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

  router.route("/accounts/activate/:user_id")
    .post(authenticate, function(req, res){
      if(req.userRole == "user"){
        res.status(400).json({"message": "Not Aurthorized for this request"});
        return;
      }
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
            "message": "User Activated"
          };
          res.status(200).json(response);
        }
      });
  });

  // ### Logging In and Logging Out a user
  router.route("/accounts/login")
    .post(function (req, res){
      if(!req.body.username || !req.body.password){
        res.status(400).json({"message": "Request Format Error", "required": variables.login});
      }
      else{
        //password is md5
        var data = [req.body.username, (md5(req.body.password))];
        var loginQuery = "SELECT * FROM users WHERE username = ? AND password = ? AND active = 1";
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
               //token is date + password hashed with sha256
              var token = sha((new Date()) + req.body.password);

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
    .post(authenticate, function (req, res){
        var logoutQuery = "UPDATE session SET ? WHERE token = ?"
        con.query(logoutQuery, [{"token": "-1"}, req.get("token")], function(err, data){
          if(err){
            var response = {
              "message": "Cannot Logout User, Check Credentials",
              "error": err
            };
            res.status(400).json(response);
          }
          else{
            res.status(200).json({"message": "Successfully Logged Out"});
          }
        });
    });

  // ### Getting a list of all the users
  //permissions, different responses for admin and normal user
  router.route("/accounts/users")
    .get(authenticate, function(req, res){
      if(req.userRole == "user"){
        var response = {
          "message": "Not Aurthorized for this request!"
        };
        res.status(400).json(response);
        return;
      }
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
}
