'use strict';

module.exports = function(args){
  this.moveForward = function(drone, time, speed, callback){
    drone.forward(speed);
    setTimeout(function(){
      callback();
    }, time);
  }

  this.moveBack = function(drone, time, speed, callback){
    drone.backword(speed);
    setTimeout(function(){
      callback();
    }, time);
  }

  this.moveRight = function(drone, time, angle, callback){
    drone.right(angle);
    setTimeout(function(){
      callback();
    }, time);
  }

  this.moveLeft = function(drone, time, angle, callback){
    drone.left(angle);
    setTimeout(function(){
      callback();
    }, time);
  }
}
