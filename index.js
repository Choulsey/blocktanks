var WebSocketServer = require("ws").Server

var express = require("express");
var app = express()
var server = require("http").createServer(app);
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))


server.listen(port)

var wss = new WebSocketServer({server: server})


wss.on("connection", function(ws) {
	ws.send("hello");
});

