// Setup basic express server
var WebSocketServer = require("ws").Server;

var express = require('express')
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server,{"pingInterval":4000,"pingTimeout":4000,"transports":["polling"]}),

app.set('port', (process.env.PORT || 5000));



server.listen(app.get('port'));

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var wss = new WebSocketServer({server: server});




