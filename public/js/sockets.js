socket.on("new tank",function(msg){
	
	
});

socket.on("update tank",function(msg){
	//console.log(msg);
	//console.log(server_tanks);
	
	
});

socket.on("server tanks",function(msg){
	alert("tanks found!");
	console.log(msg);
	if (msg != {}){
	for (var server_tank in msg){
		if(server_tank != name){
		
		
		new_server_tank = game.add.sprite(msg[server_tank].x,msg[server_tank].y,"body");
		new_server_tank.anchor.set(0.5);
		new_server_tank.scale.set(TANK_SIZE);
		server_tanks[server_tank] = new_server_tank;
		
		}
	}
	}
	
	
	
});

socket.on("new bullet",function(msg){

	bullets.push(make_server_bullet(msg.x,msg.y,msg.changex,msg.changey));
});

socket.on("disconnection",function(msg){
	server_tanks[msg].destroy();
	delete server_tanks[msg];
	
	
	
});