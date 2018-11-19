var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user");

// connect to db
mongoose.connect("mongodb://localhost/auth_demo_app");

/****************************************************************************** 
CONFIG
******************************************************************************/

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// tell app to use express-session
app.use(require("express-session")({
  secret: "This is a secret",
  resave: false,
  saveUninitialized: false
}));

// tell the app to use passport
app.use(passport.initialize());
app.use(passport.session());

// reading session and encoding it and put it back in the session
passport.serializeUser(User.serializeUser());
// reading session and un-encoding it
passport.deserializeUser(User.deserializeUser());



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

// REGISTER ROUTE
// show signup form
app.get("/register", function(req, res){
  res.render("register");
});
// handle user sign up
app.post("/register", function(req, res){
  req.body.username;
  req.body.password;

  // Add password as 2nd argument so that it will be encrypted first before saving to db.
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    } 
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });
  });
});

/****************************************************************************** 
SERVER 
******************************************************************************/

app.listen(3000, function(){
  console.log("Auth Server has started...");
});