'use strict';

module.exports = {
  moveForward: function(drone, time, speed, callback){
    drone.forward(speed);
    setTimeout(function(){
      callback();
    }, time);
  },

  moveBack: function(drone, time, speed, callback){
    drone.backward(speed);
    setTimeout(function(){
      callback();
    }, time);
  },

  moveRight: function(drone, time, angle, callback){
    drone.right(angle);
    setTimeout(function(){
      callback();
    }, time);
  },

  moveLeft: function(drone, time, angle, callback){
    drone.left(angle);
    setTimeout(function(){
      callback();
    }, time);
  }
}
