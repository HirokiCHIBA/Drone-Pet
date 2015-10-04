var functions = require('./functions.js');
var sumo = require('./sumo-custom.js');

var jun = module.exports = sumo.createClient();

var twitter = require('./tweet.js');

var texts = [
  "たのしー",
  "なにかあるにゃん",
  "ハッカソンすきにゃん"
];

var tweetFunc = function tweet() {
  var ev = new EventEmitter;
  setTimeout(function() {
    jun.takePicture();
    twitter.tweet_with_image(texts[ Math.floor( Math.random() * (texts.length) )], 'sample.jpg', function() {
      ev.emit('motion-done');
    });
  }, 1000);
  return ev;
}

// 最後以外は必ずEventEmitterのインスタンスを返す関数オブジェクト
var motionFunctionsCollection = {
  'hand': [
    functions.moveForward(jun, 1000, 127),
    functions.moveBack(jun, 1000, 127),
    functions.moveForward(jun, 1000, 127),
    functions.moveBack(jun, 1000, 127),
    tweetFunc,
    function stop() {jun.stop();}
  ]
};

jun.executeSecuence = function executeSecuence(command, offset) {
  if (typeof motionFunctions[command][offset] === 'undefined') return;

  var mf = motionFunctions[command][offset].call();
  if (typeof mf === 'undefined') return;
  mf.on('motion-done', function() {
    executeSecuence(command, offset + 1);
  });
}