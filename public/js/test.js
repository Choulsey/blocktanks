var socket = io();

socket.emit("hello","hello");

socket.on("hello_from_server",function(msg){
	alert('yes!');
	
});

