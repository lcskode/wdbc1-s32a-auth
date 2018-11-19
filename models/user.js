var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// add a bunch of method from passport-local-mongoose to userSchema for authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);