var Twit = require('twit')
var async = require('async')
var Tweet = require('../models/tweet')
var Tweeter = require('../models/tweeter')
var Superconductor = require('../models/superconductor')

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

exports.testAsync = function(req, res){
  async.series([
      function clearing_tweets(callback){
        Superconductor.remove({}, function(err){
          console.log('removed superconductors collection');
          callback(null);    
        });
      }, 
      function searching(callback){
        T.get('search/tweets', {q: req.body.asyncSearchTerm}, function (err, reply){
          var relevantTweets = reply.statuses;

          async.map(relevantTweets, function (currTweet, next) {
            // create a new Tweet with the relevant information 
            var new_superconductor = new Superconductor({keyword: req.body.asyncSearchTerm, tweet_text: currTweet.text, num_retweets: currTweet.retweet_count, owner_id: currTweet.user.id, user_handle: "", user_name: currTweet.user.name});
            new_superconductor.save(function(err){
              if(err)
                console.log("Couldn't save superconductor");
              console.log("saving superconductor");
            });
            console.log("Made it through step 1");
            next(null, Superconductor);
          }, function (err, results) {
            // all done with each of them
            callback(null, results);
          })
        });
      },
      function ranking(callback){
        console.log("Entering step 2");
        Superconductor.find({keyword: req.body.asyncSearchTerm}).exec(function (err, docs){
          console.log("Querying DB in step 2");
          if(err)
            return console.log("Welp. Couldn't retrieve and display your tweets: ", err);
          var superconductorList = new Array();
          for(var i=0; i<docs.length; i++){
            superconductorList.push(docs[i].name);
          }
          console.log("Made it through step 2");
          callback(null, superconductorList);
        });
      },
      function displaying(superconductorList, callback){
        //console.log("The superconductorList we're displaying is: ", superconductorList);
        res.render('_results_partial', {tweeters: superconductorList});
        console.log("Made it through step 3");
        callback(null, 'done');
      }
  ], function (err, result) {
      console.log("Finished async");   
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
        rankSuperconductors(req.body.desiredShow, function (rankings){
          res.render('_results_partial', {tweeters: rankings});
        });
    }catch(e){
        // An error has occured, log it
        console.log("Error while parsing tweets: ", e); 
    }
  });
}

function rankSuperconductors(keyword, next){
  var Tweeters = Tweeter.find({keyword: keyword}).exec(function (err, docs){
    if(err)
      return console.log("Welp. Couldn't retrieve and display your tweets: ", err);
    var superconductorList = new Array();
    console.log(docs[1]);
    for(var i=0; i<docs.length; i++){
      superconductorList.push(docs[i].name);
      console.log(docs[i].name);
    }
    next(superconductorList);
  });
}

// FOR DEBUGGING PURPOSES
exports.displayRelevantTweets = function(req, res){
  var Tweets = Tweet.find({keyword: req.body.searchParameter}).exec(function (err, docs){
    if(err)
      return console.log("Welp. Couldn't retrieve and display your tweets: ", err);
    res.render('tweetDisplay', {tweets: docs, title: 'Relevant Tweets'});
  });
}

exports.displaySuperconductors = function(req, res){
  var Superconductors = Superconductor.find({keyword: 'family guy'}).exec(function (err, docs){
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