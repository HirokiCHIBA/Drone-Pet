'use strict';

var sumo = require('node-sumo');
var functions = require('./functions.js');

var jun = sumo.createClient();

jun.connect(function(){
  functions.moveForward(jun, 500, 100, function(){
    functions.moveBack(jun, 500, 100, function(){
      functions.moveRight(jun, 500, 90, function(){
        functions.moveLeft(jun, 500, 90, function(){
          jun.animationHighJump();
          jun.stop();
        })
      })
    })
  })   
});
