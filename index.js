var WebSocketServer = require("ws").Server;
var express = require('express')
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server,{"pingInterval":4000,"pingTimeout":4000,"transports":["polling"]}),
app.set('port', (process.env.PORT || 5000));
server.listen(app.get('port'));
app.use(express.static(__dirname + '/public'));
var wss = new WebSocketServer({server: server});


wss.on('connection', function(ws) {
  ws.on('message', function(message) {
	dataObject = JSON.parse(message);
	evt = dataObject[0];
	data = dataObject[1];
	if (evt == "connection"){
		ws.send(message);
	}
	
  });
   
 

});



