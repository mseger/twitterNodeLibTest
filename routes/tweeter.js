var Twit = require('twit')

var T = new Twit({
    consumer_key:         'XkbATPecis4rGUj8w2PhQ'
  , consumer_secret:      '1zWqzrywoKiMgvvXgQsKdLM1uWqkQKUXxMdPT4pezh4'
  , access_token:         '277122908-G1aQhKfCMeEcPjqOc4PD5T3b2oy0wyiyxmjousR2'
  , access_token_secret:  'KtDWb9x3R1Gw4CIr2AkElmwMWuRc6ZRvAb075Co6M8'
})

exports.newTweet = function(req, res){
	T.post('statuses/update', {status: 'hello world!'}, function (err, reply){
		if(err)
			console.log("Error tweeting: ", err);
		res.redirect('http://twitter.com/dismanntled');
	});
}

exports.searchTweets = function(req, res){
	T.get('search/tweets', {q:'Obama'}, function (err, reply) {
		if(err)
			console.log("Error searching for tweets");
		try {
  			var relevantTweets = reply.statuses;
  			for(var i=0; i<relevantTweets.length; i++){
  				console.log("The next tweet is\n\n ", relevantTweets[i].text);
  			}
		} catch(e){
  			// An error has occured, log it
  			console.log("Error while parsing tweets: ", e);
		}
	});
}

// should contemplate caching these in some way to build up a db for popular topics