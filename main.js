'use strict';

var drone = require('node-sumo');
var jun = drone.createClient();

jun.connect(function(){
  console.log("connected");
  jun.postureJumper();
  jun.forward(50);
  setTimeout(function(){
    jun.stop();
  }, 1000);
});

jun.on("battery", function(battery){
  console.log("battery: " + battery);
})
