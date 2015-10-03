'use strict';

const EventEmitter = require('events').EventEmitter;

function doneInSeconds(time) {
  var ev = new EventEmitter;
  setTimeout(function() {
    ev.emit('motion-done');
  }, time);
  return ev;
}

module.exports = {
  moveForward: function(drone, time, speed){
    return function() {
      drone.forward(speed);
      return doneInSeconds(time);
    }
  },

  moveBack: function(drone, time, speed){
    return function() {
      drone.backward(speed);
      return doneInSeconds(time);
    }
  },

  moveRight: function(drone, time, angle){
    return function() {
      drone.right(angle);
      return doneInSeconds(time);
    }
  },

  moveLeft: function(drone, time, angle){
    return function() {
      drone.left(angle);
      return doneInSeconds(time);
    }
  }
}
