var functions = require('./functions.js');
var sumo = require('./sumo-custom.js');
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var jun = module.exports = sumo.createClient();

var turn180Time = 360;
var pA_pS = 3300;
var pB_pA = 3600;

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
    exec("afplay 'takepic.mp3' -r 1.4 -q 1");
    twitter.tweet_with_image(texts[ Math.floor( Math.random() * (texts.length) )], 'sample.jpg', function() {
      ev.emit('motion-done');
    });
  }, 1000);
  return ev;
}

// 最後以外は必ずEventEmitterのインスタンスを返す関数オブジェクト
var motionFunctionsCollection = {
  'hand': [
    // functions.moveForward(jun, pA_pS, 40),//pAに移動する
    // functions.delay(jun,1000),
    // functions.delay(jun, 1000),
    // functions.moveLeft(jun,turn180Time,100),//回れ右
    // functions.delay(jun, 1000),
    // functions.moveForward(jun, pB_pA, 40),//pBに移動する
    // functions.delay(jun,1000),//マスターがカバンを置く
    // functions.moveRight(jun,turn180Time,100),//回れ右
    // functions.delay(jun, 1000),
    // functions.moveForward(jun, pB_pA, 40),//pAに移動する
    // //-- 猫じゃらしタイム--
    // functions.delay(jun,1000),//マスターが猫じゃらしを取る
    // functions.moveRight(jun,turn180Time/2,100),//猫じゃらしに合わせて回転
    // functions.moveRight(jun,turn180Time/2,100),//猫じゃらしに合わせて回転
    // functions.delay(jun,1000),//マスターが猫じゃらしを片付ける
    // ////--椅子タイム--
    // functions.moveForward(jun, pA_pS, 40),//pSに移動する
    // functions.delay(jun, 1000),
    // functions.moveLeft(jun,turn180Time/2,100),//90度回転=スクリーンを向く
    // functions.jump(jun,2000),
    // functions.delay(jun,1000),//マスターが椅子から下ろす
    // ////--芸タイム--
    // functions.coolSpinJump(jun,2000),//スピン
    // tweetFunc(),
    // function stop() {jun.stop();}
  ],
  'spin': [
    functions.coolSpin(jun, 3000)
  ],
  'bigspin': [
    functions.coolSpinJump(jun, 3000)
  ],
  'jump': [
    functions.jump(jun, 3000)
  ]
};

jun.executeSecuence = function executeSecuence(command, offset) {
  if (typeof motionFunctionsCollection[command][offset] === 'undefined') return;

  var mf = motionFunctionsCollection[command][offset].call();
  if (typeof mf === 'undefined') return;
  mf.on('motion-done', function() {
    executeSecuence(command, offset + 1);
  });
}
