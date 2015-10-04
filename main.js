'use strict';

var sumo = require('./sumo-custom.js');
var functions = require('./functions.js');

var jun = sumo.createClient();

// 最後以外は必ずEventEmitterのインスタンスを返す関数オブジェクト
var motionFunctions = [
  functions.moveForward(jun, 1000, 127),
  functions.moveBack(jun, 1000, 127),
  functions.moveForward(jun, 1000, 127),
  functions.moveBack(jun, 1000, 127),
  function() {jun.stop();}
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
