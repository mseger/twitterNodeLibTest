var mongoose = require('mongoose'), Schema = mongoose.Schema

var tweetSchema = new Schema({
	keyword: String, 
	text: String,
	num_retweets: Number, 
	owner_id: Number
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;