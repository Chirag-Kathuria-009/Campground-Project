var mongoose = require('mongoose');
var campground = require('./models/campground');
var comment = require('./models/comment');
var data = [
    {
        name : "Spiti Valley Himachal Pradesh",
        img : "https://c8.alamy.com/comp/F72KG6/camping-in-the-remote-spiti-valley-himachal-pradesh-himalayas-F72KG6.jpg",
        description : "Spiti Valley nestled in the Keylong district of Himachal Pradesh There are barren hills, beautiful lakes, monasteries, lush valleys and stark beauty of nature."                     
    },
    {
        name : 'Tso Moriri,Ladakh',
        img: "http://www.campsofladakh.com/data/images/dsc_2135.jpg",
        description: "It is one of the highest lakes in the world Lake here remains frozen for most part of year"
    },
    {
        name:"Nameri Eco Camp, Assam",
        img: "https://media-cdn.tripadvisor.com/media/photo-s/07/47/e9/f7/nameri-eco-camp.jpg",
        description: "It is not only famous for splendid location but also for its various adventure Anyone can connect with wildlife while camping here"
    }
]
function db(){
    campground.remove({},function(err){
        if(err){
            console.log(err)
        }
        console.log('All campgrounds are removed');
        data.forEach(function(db){
            campground.create(db,function(err,campground){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Added a campground');
                    comment.create(
                        {
                            author:"TripathiJi",
                            text: "Best season to visit is between May to July"
                        },function(err,comment){
                            if(err){
                                console.log(err)
                            }
                            else{
                                campground.comment.push(comment);
                                campground.save();
                                console.log('New Campground is added');
                            }
                        }
                    );
                    
                }

            });
        });
    });
}
module.exports = db;
