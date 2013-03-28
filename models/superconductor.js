var mongoose = require('mongoose'), Schema = mongoose.Schema

var superconductorSchema = new Schema({
	keyword: String, 
	tweet_text: String, 
	num_retweets: Number, 
	owner_id: Number, 
	user_handle: String, 
	user_name: String 
});

var Superconductor = mongoose.model('Superconductor', superconductorSchema);

module.exports = Superconductor;