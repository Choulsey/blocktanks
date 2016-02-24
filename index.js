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
clients = {}

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
		
		
		tanks[data.username] = {x:data.x,y:data.y};
		clients[data.username] = {connection:ws};
		
		broadcast(message);
		ServerTanks = {event:"server tanks",data:tanks};
		
		
		ws.send(JSON.stringify(ServerTanks));
	}
	if (evt == "update tank" || evt == "new bullet" || evt == "dead"){
		broadcast(message);
	}


  });
  
 ws.on('close', function() {
   
   console.log(" user logged off.");
   for (var key in clients){
	   if (clients[key].connection == ws){
		   disconnectedplayer = key;
		   delete tanks[key];
		   delete clients[key];
	   }
   }
   
   broadcast(JSON.stringify({event:"disconnection",data:{username:disconnectedplayer}}));
 });
 

});



