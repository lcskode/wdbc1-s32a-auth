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

// create new local strategy using user.authenticate method during login coming from passport-local-mongoose
passport.use(new localStrategy(User.authenticate()));
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
// add isLoggedIn middleware, will run isLoggedIn first. If user is logged in, continue loading secret page. If not logged in, redirect to login page.
app.get("/secret", isLoggedIn, function(req, res){
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

// LOGIN ROUTES
// show login form
app.get("/login", function(req, res){
  res.render("login");
});
// handle user login
// middleware - code that runs before the final route callback. When app gets POST request, middleware will run immediately.
// middleware - sits between then beginning and end of route.
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req, res){

});

// LOGOUT ROUTE
app.get("/logout", function(req, res){
  // res.render("logout");
  // res.send("WILL LOG YOU OUT BUT NOT YET...");
  req.logout();
  res.redirect("/");
});

// add isLoggedIn middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  // does not require else statement since return is used.
  res.redirect("login");
}

/****************************************************************************** 
SERVER 
******************************************************************************/

app.listen(3000, function(){
  console.log("Auth Server has started...");
});