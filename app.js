var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect('mongodb://127.0.0.1/yelp_camp');
var campSchema = new mongoose.Schema({
    name: "String",
    img: "String",
    dscription: "String"
});
var Campground = mongoose.model('Campground',campSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.get('/',function(req,res){
    res.render("landing");
});
app.get('/campgrounds',function(req,res){
    Campground.find({},function(newcamps,err){
        if(err){
            console.log(err);
        }else{
            res.render("campground",{campground:newcamps});
        }
    }); 
});
app.post('/campgrounds',function(req,res){
    
    var name = req.body.name;
    var image = req.body.img;
    var newCampground = {name:name,img:image}
    Campground.create(newCampground,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/campgrounds');
        }
    });
    //camp.push(newCampground);
    
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
app.listen(3030);
