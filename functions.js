'use strict';

var EventEmitter = require('events').EventEmitter;

function doneInSeconds(drone, time) {
  var ev = new EventEmitter;
  setTimeout(function() {
    drone.stop();
    ev.emit('motion-done');
  }, time);
  return ev;
}

module.exports = {
  moveForward: function(drone, time, speed){
    return function() {
      drone.forward(speed);
      return doneInSeconds(drone, time);
    }
  },

  moveBack: function(drone, time, speed){
    return function() {
      drone.backward(speed);
      return doneInSeconds(drone, time);
    }
  },

  moveRight: function(drone, time, angle){
    return function() {
      drone.right(angle);
      return doneInSeconds(drone, time);
    }
  },

  moveLeft: function(drone, time, angle){
    return function() {
      drone.left(angle);
      return doneInSeconds(drone, time);
    }
  },

  stop: function(drone) {
    return function() {
      var ev = new EventEmitter;
      console.log('stop')
      drone.stop();
      drone.on('stop', function() {
        ev.emit('motion-done');
      });
      return ev;
    }
  }
}
