// node-gyp
// twitter
// request
// form-data
// utf8
// base-64
// node-base64-image

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'wFSZEo0T7eWpAdOeOQtLQQIoO',
  consumer_secret: 'TfGAfoutWU2QkV1XWp0GiXhVhvccXvUJufFxy1uf67zDJHHjNK',
  access_token_key: '3768794238-uwg5XCwb63sn0IQflgwuAJh1m2fKHzKM47zNkyE',
  access_token_secret: 's3Sh5fSkYtgn64P4FCjPsciBnnAI5dJ2JNGniZRlK44oE'
});

var request = require('request');
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');
var utf8 = require('utf8');
var base64 = require('node-base64-image');


module.exports = {

  screen_name: 'mi_ni_drones',

  tweet: function(message, callback) {

    var params = {
      status: message
    }

    client.post('statuses/update', params, function(error, tweets, response){
      if (!error) {
        console.log(tweets);
      }
      callback(error, tweets, response);
    });
  },

  tweet_with_image: function(message, image, callback) {

    var image = fs.readFileSync(image);
    var params = {
    	screen_name: this.screen_name,
    	media_data: image.toString('base64')
    };

    client.post('media/upload', params, function(error, tweets, response){
      if (error) {
        console.log(tweets);
      }

      var params = {
        status: message,
        media_ids: tweets.media_id_string
      }

      client.post('statuses/update', params,  function(error, tweet, response){
        if(error) {
          console.log(error)
        }
        callback(error, tweets, response);
      });
    });
  }
}
