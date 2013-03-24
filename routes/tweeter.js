var Twit = require('twit')
var Tweet = require('../models/tweet')
var Tweeter = require('../models/tweeter')

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
  T.get('search/tweets', {q: req.body.desiredShow}, function (err, reply) {
    if(err)
      console.log("Error searching for tweets");
    try {
        var relevantTweets = reply.statuses;
        for(var i=0; i<relevantTweets.length; i++){
          // grab each tweet, do basic analysis 
          var currTweet = relevantTweets[i];

          // create a new Tweet with the relevant information 
          var new_tweet = new Tweet({keyword: req.body.desiredShow, text: currTweet.text, num_retweets: currTweet.retweet_count, owner_id: currTweet.user.id});
          new_tweet.save(function (err){
            if(err)
              return console.log("Couldn't parse + save tweet: ", err);
            // now to save the user information associated with each tweet
            var new_user = new Tweeter({name: currTweet.user.name, keyword: req.body.desiredShow, user_id: currTweet.user.id, num_followers: currTweet.user.friends_count, num_tweets: currTweet.user.statuses_count});
            new_user.save(function (err){
              if(err)
                return console.log("Couldn't parse + save user info associated with tweet: ", err);
            });
          });
        }
        //res.redirect('/displayTweets');
    }catch(e){
        // An error has occured, log it
        console.log("Error while parsing tweets: ", e); 
    }
  });
}

/*exports.rankSuperconductors = function(req, res){
  var Tweeters = Tweeter.find({keyword: req.body.searchParameter})
}*/

// FOR DEBUGGING PURPOSES
exports.displayRelevantTweets = function(req, res){
  var Tweets = Tweet.find({keyword: req.body.searchParameter}).exec(function (err, docs){
    if(err)
      return console.log("Welp. Couldn't retrieve and display your tweets: ", err);
    res.render('tweetDisplay', {tweets: docs, title: 'Relevant Tweets'});
  });
}

// clear our db and get rid of all tweets hangin' around
exports.deleteAllTweets = function(req, res){
  Tweet.remove({}, function(err){
    console.log('removed tweets collection');
    res.redirect('/');1
  })
}

// clear our db and get rid of all tweeters hangin' around
exports.deleteAllTweeters = function(req, res){
  Tweeter.remove({}, function(err){
    console.log('removed tweeters collection');
    res.redirect('/');
  })
}
// should contemplate caching these in some way to build up a db for popular topics