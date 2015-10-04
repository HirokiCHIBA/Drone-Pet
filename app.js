var http = require('http');
var WSServer = require('websocket').server;
var jun = require('./jun.js');

var url = require('url');
var clientHtml = require('fs').readFileSync('www/client.html');

var plainHttpServer = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html'});
	res.end(clientHtml);
}).listen(8888);

var webSocketServer = new WSServer({httpServer: plainHttpServer});
var accept = ['localhost', '127.0.0.1'];

var startupTime = new Date().getTime();
var commandCount = 0;

var wssConnections = [];
jun.connect(function() {
  webSocketServer.on('request', function (req) {
    req.origin = req.origin || '*';
    if (accept.indexOf(url.parse(req.origin).hostname) === -1) {
      req.reject();
      console.log(req.origin + ' access not allowed.');
      return;
    }

    var websocket = req.accept(null, req.origin);
    wssConnections.push(websocket);
    websocket.send(JSON.stringify({"startupTime": startupTime}));

    websocket.on('message', function(msg) {
      var msgObj = JSON.parse(msg.utf8Data);
      if (typeof msgObj['command'] !== 'undefined') {
        jun.executeSecuence(msgObj['command'], 0);
        commandCount++;
        broadcast(JSON.stringify({"commandCount": commandCount}));
      }
      console.log('"' + msg.utf8Data + '" is recieved from ' + req.origin + '!');
    //  if (msg.utf8Data === 'Hello') {
    //    websocket.send('sended from WebSocket Server');
    //  }
    });

    websocket.on('close', function (code,desc) {
      console.log('connection released! :' + code + ' - ' + desc);

      wssConnections = wssConnections.filter(function (conn, i) {
          return (conn === websocket) ? false : true;
      });
    });
  });
})

function broadcast(message) {
  wssConnections.forEach(function (con, i) {
      con.send(message);
  });
}

jun.on('battery', function(battery) {
	var msg = JSON.stringify({'battery': battery});
	broadcast(msg);
});
