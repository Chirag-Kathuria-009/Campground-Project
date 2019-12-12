var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require("passport");
var session = require("express-session");
var LocalStrategy = require("passport-local");
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var db = require('./db');
mongoose.connect('mongodb://127.0.0.1/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
db();
app.use("session",({
    resave:false,
    saveUnitialized:false
}));
app.use(passport.Initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
});

app.get('/',function(req,res){
    res.render("landing");
});
app.get('/campgrounds',function(req,res){
    Campground.find({},function(err,newcamps){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campground:newcamps});
        }
    }); 
});
app.post('/campgrounds',function(req,res){
    
    var name = req.body.name;
    var image = req.body.img;
    var desc = req.body.description;
    var newCampground = {name:name,img:image,description:desc}
    Campground.create(newCampground,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/campgrounds');
        }
    });
});
app.get('/campground/new',function(req,res){
    res.render("newCamp");
});
app.get("campground/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{"campground":foundcampground});
        }
    });
});
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
app.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
 });
 app.get("/signup", function(req, res){
    res.render("signup"); 
 });
 app.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.signup(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

app.get("/login", function(req, res){
    res.render("login"); 
});
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3030);