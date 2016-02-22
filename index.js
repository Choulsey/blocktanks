var WebSocketServer = require("ws").Server;
var express = require('express')
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server,{"pingInterval":4000,"pingTimeout":4000,"transports":["polling"]}),
app.set('port', (process.env.PORT || 5000));
server.listen(app.get('port'));
app.use(express.static(__dirname + '/public'));
var wss = new WebSocketServer({server: server});

tanks = {}

broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};




wss.on('connection', function(ws) {
  ws.on('message', function(message) {
	dataObject = JSON.parse(message);
	evt = dataObject.event;
	data = dataObject.data;
	
	if (evt == "new tank"){
		console.log(data.username + " logged on.")
		
		clientId = data.username;
		tanks[data.username] = {x:data.x,y:data.y};
		
		broadcast(message);
		ServerTanks = {event:"server tanks",data:tanks};
		
		console.log(tanks)
		ws.send(JSON.stringify(ServerTanks));
	}
	if (evt == "update tank"){
		
		broadcast(message);
	}

  });
  
 ws.on('close', function(connection) {
   delete tanks[clientId];
   console.log(connection.remoteAddress + " logged off.");
   console.log(tanks)
   broadcast(JSON.stringify({event:"disconnection",data:{username:clientId}}));
 });
 

});



