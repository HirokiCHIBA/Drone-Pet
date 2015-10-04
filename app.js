var http = require('http');
var WSServer = require('websocket').server;

var url = require('url');
var clientHtml = require('fs').readFileSync('www/client.html');

var plainHttpServer = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html'});
	res.end(clientHtml);
}).listen(8888);

var webSocketServer = new WSServer({httpServer: plainHttpServer});
var accept = ['localhost', '127.0.0.1'];

var wssConnections = [];
webSocketServer.on('request', function (req) {
	req.origin = req.origin || '*';
	if (accept.indexOf(url.parse(req.origin).hostname) === -1) {
		req.reject();
		console.log(req.origin + ' access not allowed.');
		return;
	}

	var websocket = req.accept(null, req.origin);

  wssConnections.push(websocket);
	websocket.on('message', function(msg) {
		console.log('"' + msg.utf8Data + '" is recieved from ' + req.origin + '!');
	// 	if (msg.utf8Data === 'Hello') {
	// 		websocket.send('sended from WebSocket Server');
	// 	}
	});

	websocket.on('close', function (code,desc) {
		console.log('connection released! :' + code + ' - ' + desc);

    wssConnections = wssConnections.filter(function (conn, i) {
        return (conn === ws) ? false : true;
    });
	});
});

function broadcast(message) {
  wssConnections.forEach(function (con, i) {
      con.send(message);
  });
}

var sumo = require('./sumo-custom.js');
var functions = require('./functions.js');
var jun = sumo.createClient();

jun.on('battery', function(battery) {
	var msg = JSON.stringify({'battery': battery});
	webSocketServer.send(msg, function() {
		broadcast('success');
	});
})

var twitter = require('./tweet.js');
var tweetFunc = function tweet() {
  var ev = new EventEmitter;
  setTimeout(function() {
    jun.takePicture();
    twitter.tweet_with_image('Cテスト', 'sample.jpg', function() {
      ev.emit('motion-done');
    });
  }, 1000);
  return ev;
}

// 最後以外は必ずEventEmitterのインスタンスを返す関数オブジェクト
var motionFunctions = [
  functions.moveForward(jun, 1000, 127),
  functions.moveBack(jun, 1000, 127),
  functions.moveForward(jun, 1000, 127),
  functions.moveBack(jun, 1000, 127),
  tweetFunc,
  function stop() {jun.stop();}
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
