/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , tweeter = require('./routes/tweeter')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect(process.env.MONGOLAB_URI || 'localhost');
});

// GETS
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/tweeter/new', tweeter.newTweet);
app.get('/deleteAllTweets', tweeter.deleteAllTweets);
app.get('/deleteAllTweeters', tweeter.deleteAllTweeters);
app.get('/testAsync', tweeter.testAsync);
//app.get('/fullResultsPage', tweeter.fullResultsPage);

// POSTS
app.post('/searchTweets', tweeter.searchTweets);
app.post('/testAsync', tweeter.testAsync);
//app.post('/goToResultsPage', tweeter.goToResultsPage);

// FOR DEBUGGING PURPOSES
app.get('/displayTweets', tweeter.displayRelevantTweets);
app.post('/displayTweets', tweeter.displayRelevantTweets);
app.get('/displaySuperconductors', tweeter.displaySuperconductors);




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
