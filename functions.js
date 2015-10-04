'use strict';

var EventEmitter = require('events').EventEmitter;
var exec = require('child_process').exec;

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

  delay: function(drone, time){
    return function(){
      return doneInSeconds(drone, time);
    }
  },

  jump: function(drone, time){
    return function(){
      exec("afplay 'jump.mp3'");
      drone.animationsHighJump();
      return doneInSeconds(drone, time);
    }
  },
  coolSpin: function(drone, time){
<<<<<<< HEAD
    return function() {
      drone.animationsSpin();
      return doneInSeconds(drone, time);
    }
=======
     return function() {
       drone.animationsMetronome();
      exec("afplay 'spin.mp3'");
       return doneInSeconds(drone, time);
     }
>>>>>>> fa5299192290502a0dc3c8bc82b845700a089ccd
  },
  coolSpinJump: function(drone, time){
    return function(){
      exec("afplay 'bigSpin.mp3'");
      drone.animationsMetronome();
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
