/****************************************************************************** 
CONFIG
******************************************************************************/

var express = require("express");
var app = express();
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");

app.set("view engine", "ejs");



/****************************************************************************** 
ROUTES 
******************************************************************************/

// ROOT ROUTE
app.get("/", function(req, res){
  res.render("home");
});

// SECRET ROUTE
app.get("/secret", function(req, res){
  res.render("secret");
});


/****************************************************************************** 
SERVER 
******************************************************************************/

app.listen(3000, function(){
  console.log("Auth Server has started...");
});