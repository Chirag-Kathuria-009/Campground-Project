var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userScehma = mongoose.model({
    username: String,
    password : String
});

userScehma.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',userSchema);
