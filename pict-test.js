"use strict";

var sumo = require('./sumo-custom.js');
var drone = sumo.createClient();

process.stdin.setRawMode(true);
process.stdin.resume();

drone.connect(function() {
  console.log("Connected...");
  console.log("Space  : taking picture");
  console.log("Escape : exit");
  drone.postureJumper();
  drone.animationsTap();
});

drone.on("battery", function(battery) {
  console.log("battery: " + battery);
});

drone.on("internalPicture", function() {
  console.log();
  console.log("A picture was saved into the drone's internal memory!");
});

var keypress = require('keypress');
keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
  console.log(key);
  if (key.name === 'space') {
    drone.takePicture();
    console.log('Drone will take a picture and save it internally');
  } else if (key.name === 'escape') {
      process.stdin.pause();
      process.exit();
  }
});