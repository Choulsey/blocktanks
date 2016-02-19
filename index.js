// Setup basic express server
var express = require('express')
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server,{"transports",["websocket"]}),

app.set('port', (process.env.PORT || 5000));

var tankdata = {}

server.listen(app.get('port'));

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom



io.on('connection', function (socket) {
	socket.on("new tank",function(msg){
		
		console.log(msg.username + " connected");
		
		socket.username = msg.username;
		tankdata[msg.username] = {x:msg.x,y:msg.y};
		console.log(msg.x);
		console.log(msg.y);
		socket.broadcast.emit("new tank",{username:msg.username,x:msg.x,y:msg.y})
		socket.emit("server tanks",tankdata);
		console.log(tankdata);
	})
	socket.on("update tank",function(msg){

		tankdata[msg.username] = {x:msg.x,y:msg.y};
		
		socket.broadcast.emit("update tank",{username:msg.username,x:msg.x,y:msg.y});
	});
	
	socket.on("new bullet",function(msg){

		socket.broadcast.emit("new bullet",{x:msg.x,y:msg.y,changex:msg.changex,changey:msg.changey});
	});
	
	socket.on('disconnect', function(){
		console.log(socket.username + " logged off");
		
		delete tankdata[socket.username];
		socket.broadcast.emit("disconnection",socket.username);
		console.log(tankdata);
	});
	
});


