// var tweet = require('./tweet.js')
var tweet = require('./tweet.js');
var message = "ツイートしました";
var image = './sample.gif';


tweet.tweet(message, function(error, tweet, response) {
  console.log(error, tweet, response);
});

tweet.tweet_with_image(message, image, function(error, tweet, response) {
  console.log(error, tweet, response);
});

