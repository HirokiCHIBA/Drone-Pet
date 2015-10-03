var RollingSpider = require("rolling-spider");
var keypress = require('keypress');
keypress(process.stdin);

process.stdin.setRawMode(true);
process.stdin.resume();

var ACTIVE = true;
var STEPS = 5;
var d = new RollingSpider({uuid:"625f9e251f0243d28f27dafa7eb517b9"});

function cooldown() {
  ACTIVE = false;
  setTimeout(function () {
    ACTIVE = true;
  }, STEPS);
}

d.connect(function () {

  d.setup(function () {
    console.log('Configured for Rolling Spider! ', d.name);
    d.flatTrim();
    d.startPing();
    d.flatTrim();
/*
    d.on('battery', function () {
      console.log('Battery: ' + d.status.battery + '%');
      d.signalStrength(function (err, val) {
        console.log('Signal: ' + val + 'dBm');
      });

    });

    d.on('stateChange', function () {
      console.log(d.status.flying ? "-- flying" : "-- down");
    })
*/
    setTimeout(function () {
      console.log(d.name + ' => SESSION START');
      ACTIVE = true;
    }, 1000);

  });
});

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {

  console.log('got "keypress" => ', key);

  if (ACTIVE && key) {

    var param = {tilt:0, forward:0, turn:0, up:0};

    if (key.name === 'l') {
      console.log('land');
      d.land();
    } else if (key.name === 't') {
      console.log('takeoff');
      d.takeOff();
    } else if (key.name === 'h') {
      console.log('hover');
      d.hover();
    } else if (key.name === 'x') {
      console.log('disconnect');
      d.disconnect();
      process.stdin.pause();
      process.exit();
    }

    if (key.name === 'w') {
      d.forward({ steps: STEPS });
      cooldown();
    } else if (key.name === 's') {
      d.backward({ steps: STEPS });
      cooldown();
    } else if (key.name === 'd') {
      d.tiltRight({ steps: STEPS });
      cooldown();
    } else if (key.name === 'a') {
      d.tiltLeft({ steps: STEPS });
      cooldown();
    } else if (key.name === 'up') {
      d.up({ steps: STEPS });
      cooldown();
    } else if (key.name === 'down') {
      d.down({ steps: STEPS });
      cooldown();
    } else if (key.name === 'right') {
      d.turnRight();
      cooldown();
    } else if (key.name === 'left') {
      d.turnLeft();
      cooldown();
    }

    if (key.name === 'm') {
      param.turn = 90;
      d.drive(param, STEPS);
      cooldown();
    }
    if (key.name === 'h') {
      param.turn = -90;
      d.drive(param, STEPS);
      cooldown();
    }
    if (key.name === 'f') {
      d.frontFlip();
      cooldown();
    }
    if (key.name === 'b') {
      d.backFlip();
      cooldown();
    }

  }
});