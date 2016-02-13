// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.set('port', (process.env.PORT || 5000));

var tankdata = {}



// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom
server.listen(app.get('port'), function () {
  console.log('Server listening at port %d', port);
});

var io = require('socket.io')(server).listen(server, {'pingTimeout':4000, 'pingInterval':80,"transport":['websocket']});

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
	
	socket.on('disconnect', function(){
		console.log(socket.username + " logged off");
		
		delete tankdata[socket.username];
		socket.broadcast.emit("disconnection",socket.username);
		console.log(tankdata);
	});
	
});


