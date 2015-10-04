'use strict';

const EventEmitter = require('events').EventEmitter;

var sumo = require('./sumo-custom.js');
var functions = require('./functions.js');
var twitter = require('./tweet.js');

var jun = sumo.createClient();

var turn180Time = 360;
var pA_pS = 3300;
var pB_pA = 3600;

var tweetFunc = function tweet() {
  var ev = new EventEmitter;
  setTimeout(function() {
    jun.takePicture();
    twitter.tweet_with_image('Cテスト', 'sample.jpg', function() {
      ev.emit('motion-done');
    });
  }, 1000);
  return ev;
}

// 最後以外は必ずEventEmitterのインスタンスを返す関数オブジェクト
var motionFunctions = [
  functions.moveForward(jun, pA_pS, 40),//pAに移動する
  functions.delay(jun,1000),
  functions.moveRight(jun,turn180Time*2,100),//マスターに会えて嬉しい
  functions.delay(jun,1000),//マスターが撫でてくれる
  functions.moveRight(jun,turn180Time,100),//回れ右
  functions.moveForward(jun, pB_pA, 40),//pBに移動する
  functions.delay(jun,1000),//マスターがカバンを置く
  functions.moveRight(jun,turn180Time,100),//回れ右
  functions.moveForward(jun, pB_pA, 40),//pAに移動する
  //-- 猫じゃらしタイム-- 
  functions.delay(jun,1000),//マスターが猫じゃらしを取る
  functions.moveRight(jun,turn180Time,100),//猫じゃらしに合わせて回転  
  functions.moveRight(jun,turn180Time,100),//猫じゃらしに合わせて回転
  functions.delay(jun,1000),//マスターが猫じゃらしを片付ける
  ////--椅子タイム--
  functions.moveForward(jun, pA_pS, 40),//pSに移動する
  functions.moveRight(jun,turn180Time,100),//90度回転=スクリーンを向く
  functions.jump(jun,2000),
  functions.delay(jun,1000),//マスターが椅子から下ろす
  ////--芸タイム--
  functions.coolSpinJump(jun,2000),//スピン
  //tweetFunc(),
  function stop() {jun.stop();}
  ];

  function executeSecuence(offset) {
    if (typeof motionFunctions[offset] === 'undefined') return;

    var mf = motionFunctions[offset].call();
    if (typeof mf === 'undefined') return;
    mf.on('motion-done', function() {
      executeSecuence(offset + 1);
    });
  }

jun.connect(function(){
  executeSecuence(0);
});
