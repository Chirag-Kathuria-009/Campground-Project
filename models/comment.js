var mongoose = require('mongoose');
var commentSchema = mongoose.model({
    text : String,
    author : String
});
module.exports = mongoose.model('Comment',commentSchema);
