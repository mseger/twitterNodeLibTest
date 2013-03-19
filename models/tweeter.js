var mongoose = require('mongoose'), Schema = mongoose.Schema

var tweeterSchema = new Schema({
	name: String,
	user_id: Number, 
	num_followers: Number, 
	num_tweets: Number
});

var Tweeter = mongoose.model('Tweeter', tweeterSchema);

module.exports = Tweeter;