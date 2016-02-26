var ws = new WebSocket(location.origin.replace(/^http/, 'ws'))
var server_tanks = {};

name = prompt("What is your name?");


var socket = new FancyWebSocket(ws);

socket.bind("you dead",function(msg){
	respawn(server_tanks[msg.username]);

});

socket.bind("disconnection",function(msg){
	console.log("some dude logged off");
	server_tanks[msg.username].body.destroy();
	server_tanks[msg.username].arm.destroy();
	delete server_tanks[msg.username];
});

socket.bind("new tank",function(msg){
	if (msg.username != name){
		server_tanks[msg.username] = {};
		new_tank = game.add.sprite(msg.x,msg.y,"body");
		new_tank.anchor.set(0.5);
		new_tank.scale.set(TANK_SIZE);
		server_tanks[msg.username].body = new_tank;
		
		new_arm = game.add.sprite(msg.x,msg.y,'arm');
		new_arm.anchor.set(0.5);
		new_arm.scale.set(TANK_SIZE * ARM_SIZE);
		server_tanks[msg.username].arm = new_arm;
	}
});

socket.bind("server tanks",function(msg){
	
	console.log(msg);
	if (msg != {}){
	for (var server_tank in msg){
		if(server_tank != name){
			
		alert("tank found!");
		server_tanks[server_tank] = {};
		new_server_tank = game.add.sprite(msg[server_tank].x,msg[server_tank].y,"body");
		new_server_tank.anchor.set(0.5);
		new_server_tank.scale.set(TANK_SIZE);
		server_tanks[server_tank].body = new_server_tank;
		
		new_arm = game.add.sprite(msg[server_tank].x,msg[server_tank].y,'arm');
		new_arm.anchor.set(0.5);
		new_arm.scale.set(TANK_SIZE * ARM_SIZE);
		server_tanks[server_tank].arm = new_arm;
		
		}
	}
	}
	
	

});

socket.bind("update tank",function(msg){
	if (msg.username != name){
		server_tanks[msg.username].body.x = msg.x;
		server_tanks[msg.username].body.y = msg.y;
		//server_tanks[msg.username].body.ydir = msg.ydir;
		//server_tanks[msg.username].body.xdir = msg.xdir;
		server_tanks[msg.username].arm.x = msg.x;
		server_tanks[msg.username].arm.y = msg.y;
		server_tanks[msg.username].arm.angle = msg.arm;
	}
});

socket.bind("new bullet",function(msg){
	if (msg.name != name){
	bullets.push(make_server_bullet(msg.x,msg.y,msg.changex,msg.changey));
	}
});

var W = window.innerWidth;
var H =  window.innerHeight;

var game = new Phaser.Game(W,H,Phaser.CANVAS,'game',{preload:preload,create:create,update:update,render:render},false,false);


var moved = 0;
var delay = 0;
var TANK_SPEED = 3;
var SPRINT_SPEED = 4;
var SPRINTING = false;
var unit = W/2500;
var TANK_SIZE = 0.5;
var ARM_SIZE = 1.2;
var bullets = [];
var BULLET_SPEED = 6.5;
var BULLET_COUNTER = 0;
var FIRED = false;
var WORLD_BOUNDS = {x:4000,y:3000};
var WORLD_PADDING = 1000
WORLD_PADDING = WORLD_PADDING * 2;




game.renderer.roundPixels = true;



function update_server_tanks(){
	for (var key in server_tanks){

		if (server_tanks[key].body.xdir == "A"){
			server_tanks[key].body.x -= TANK_SPEED;
		}
		if (server_tanks[key].body.xdir == "D"){
			server_tanks[key].body.x += TANK_SPEED;
		}
		if (server_tanks[key].body.ydir == "W"){
			server_tanks[key].body.y -= TANK_SPEED;
		}
		if (server_tanks[key].body.ydir == "S"){
			server_tanks[key].body.y += TANK_SPEED;
		}
		
		server_tanks[key].arm.x = server_tanks[key].body.x;
		server_tanks[key].arm.y = server_tanks[key].body.y;
		
		
	}

}

function preload(){
	game.load.image('body','assets/Tank Body.png');
	game.load.image('arm','assets/Tank arm.png');
	game.load.image('bullet','assets/bullet.png');
	game.load.image("background","assets/background.png");
	game.load.image("maze_wall","assets/maze_wall.png");
	game.load.image("maze wall left","assets/maze wall left.png")
	game.load.spritesheet('bullet_explode', 'assets/bullet_explode.png', 53, 53);
	game.time.advancedTiming = true;
}
function create(){
	background = game.add.tileSprite(WORLD_PADDING/2, WORLD_PADDING/2, 2000, 1000, "background");
	maze_list = [[[1,1],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]],[[0,1],[1,1],[1,1],[0,1],[1,1],[1,1],[1,1],[0,1],[1,0],[1,0],[1,0],[1,0],[0,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[0,1]],[[0,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,0],[0,0],[1,1],[1,1],[1,1],[1,1],[0,1],[1,0],[1,0],[1,1],[1,1],[1,1],[1,1],[0,1]],[[0,1],[1,0],[1,0],[1,1],[1,1],[0,1],[1,1],[1,1],[1,1],[1,1],[1,0],[1,0],[1,1],[1,1],[0,1],[1,1],[1,1],[1,1],[1,0],[0,0]],[[0,1],[0,0],[0,0],[1,0],[1,0],[0,0],[1,1],[1,1],[1,1],[0,1],[0,0],[0,0],[1,0],[1,0],[0,0],[1,0],[1,0],[0,0],[0,0],[0,0]],[[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[1,0],[1,0],[0,0],[0,0],[1,1],[1,1],[1,1],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,1],[0,0],[0,0],[1,1],[1,1],[0,1],[1,1],[1,1],[0,1],[0,0],[0,0],[1,1],[1,1],[1,1],[0,1],[1,1],[1,1],[0,1],[0,0],[0,0]],[[0,1],[1,1],[1,1],[1,1],[1,1],[0,1],[1,0],[1,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,0],[0,0],[1,1],[1,1],[1,1],[1,1],[0,1]],[[0,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[0,1],[1,0],[1,0],[1,0],[1,0],[0,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[0,1]],[[0,1],[1,0],[1,0],[0,0],[1,0],[1,0],[1,0],[0,0],[1,1],[1,1],[1,1],[1,1],[0,1],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[0,0]]]
	walls = maze_generator.draw_simple_maze(maze_list,100,10,"maze_wall","maze wall left",WORLD_PADDING/2,WORLD_PADDING/2);
	game.stage.backgroundColor = '#ffffff';
	tank = {}
	tank.body = game.add.sprite(1180,1510,'body');
	tank.body.anchor.set(0.5);
	tank.arm = game.add.sprite(1180,1510,'arm');
	tank.arm.anchor.set(0.5);
	tank.body.scale.set(TANK_SIZE);
	tank.arm.scale.set(TANK_SIZE * ARM_SIZE);
    game.world.setBounds(0, 0, WORLD_BOUNDS.x, WORLD_BOUNDS.y);
	game.camera.follow(tank.body);
	socket.send("new tank",{username:name,x:tank.body.x,y:tank.body.y})
	
}
function collides (a,b){

	if(a.wall_location.orientation == "left"){
    	if(a != undefined)
    	{
	    	return !(
		        ((a.top + a.height) < (b.top + 5)) ||
		        (a.top > (b.top + b.height - 5)) ||
		        ((a.left + a.width) < b.left) ||
		        (a.left > (b.left + b.width))
		    );	
    	}
	}
	else{
    	if(a != undefined)
    	{
	    	return !(
		        ((a.top + a.height) < (b.top)) ||
		        (a.top > (b.top + b.height)) ||
		        ((a.left + a.width) < b.left + 5) ||
		        (a.left > (b.left + b.width - 5))
		    );	
    	}
	}
	
};

function simple_collides (a,b){
	a.left  = (a.x - a.width * a.anchor.x)
    a.top  = (a.y - a.height * a.anchor.y)
    b.left  = (b.x - b.width * b.anchor.x) 
    b.top  = (b.y - b.height * b.anchor.y) 
	
    if(a != undefined)
    	{
	    	return !(
		        ((a.top + a.height) < (b.top)) ||
		        (a.top > (b.top + b.height)) ||
		        ((a.left + a.width) < b.left) ||
		        (a.left > (b.left + b.width))
		    );	
    	}
	}
	
	

function move_tank(tank){
	collision = {t:false,b:false,l:false,r:false};
	walls.forEach(function(wall){
		if(collides(wall,tank.body)){
			if(wall.wall_location.orientation == "left"){
				if(tank.body.x < wall.x){
					collision.r = true;
				}
				else{
					collision.l = true;
				}
			}
			
			if(wall.wall_location.orientation == "top"){
				if(tank.body.y < wall.y){
					collision.b = true;
				}
				else{
					collision.t = true;
				}
			}
		}
	},this);
	
	verticalDir = 0;
	horizontalDir = 0;
	if(game.input.keyboard.isDown(Phaser.Keyboard.A) && collision.l == false)
	{
		horizontalDir = "A";
		
		tank.body.x -= TANK_SPEED;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.D) && collision.r == false)
	{
		horizontalDir = "D";
		
		tank.body.x += TANK_SPEED;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.W) && collision.t == false)
	{
		verticalDir = "W";
		
		tank.body.y -= TANK_SPEED;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.S) && collision.b == false)
	{
		verticalDir = "S";
		
		tank.body.y += TANK_SPEED;
	}
	tank.arm.x = tank.body.x;
	tank.arm.y = tank.body.y;
	
	if (moved == 2){
	socket.send("update tank",{username:name,x:tank.body.x,y:tank.body.y,arm:tank.arm.angle});
	moved = 0;
	}
	
	moved += 1;
	
}
function deg(radians) {
  return radians * 180 / Math.PI;
}
function aim_tank(tank){
		tank.arm.angle = deg(Math.atan2(game.input.x - W/2, H/2 - game.input.y ))
}
function make_bullet(tank){
	new_bullet = game.add.sprite(tank.body.x,tank.body.y,'bullet');
	new_bullet.anchor.set(0.5);
	new_bullet.scale.set(TANK_SIZE);
	new_bullet.rotation = tank.arm.rotation;
	new_bullet.y -= Math.cos(new_bullet.rotation) * 40; //Adjust the bullet so that it comes out of the barrel.
	new_bullet.x += Math.sin(new_bullet.rotation) * 40;
	new_bullet.changex = Math.cos(new_bullet.rotation);
	new_bullet.changey = Math.sin(new_bullet.rotation);
	new_bullet.bounces = 0;
	new_bullet.mine = true;
	return new_bullet;
}

function make_server_bullet(x,y,changex,changey){
	new_bullet = game.add.sprite(x,y,'bullet');
	new_bullet.anchor.set(0.5);
	new_bullet.scale.set(TANK_SIZE);
	new_bullet.changex = changex;
	new_bullet.changey = changey;
	new_bullet.bounces = 0;
	new_bullet.mine = false;
	return new_bullet;
}

function update(){
	//update_server_tanks();
	move_tank(tank);
	aim_tank(tank);	
	if (game.input.mousePointer.isDown){
		if(FIRED == false && bullets.length < 5){
		FIRED = true;
		socket.send("new bullet",{
			x:tank.body.x,
			y:tank.body.y,
			changex:Math.cos(tank.arm.rotation),
			changey:Math.sin(tank.arm.rotation),
			name:name
			
		});
			
		bullets.push(make_bullet(tank));
		BULLET_COUNTER = 0;	
		}
	}
	
	else{
		FIRED = false;
	}
	for(i=0;i < bullets.length;i++){
		collided_top = false;
		collided_left = false;
		walls.forEach(function(wall){
			if(collides(wall,bullets[i])){
				if(wall.wall_location.orientation == "top"){
					collided_top = true;	
					
				}
				else{
					
					collided_left = true;
				}
				
			}	
		},this)
		if (collided_top || collided_left){
			if(bullets[i].bounces < 1){
				bullets[i].bounces += 1;
				if (collided_left){
				
					bullets[i].changey = 0 - bullets[i].changey;
				}
				else{
					
					bullets[i].changex = 0 - bullets[i].changex;
				}
			}
			else{
				blow_up_bullet(bullets[i]);
				bullets[i].destroy();
				bullets.splice(i,1);
				continue
			}
		}
		

		
		bullets[i].y -= bullets[i].changex * BULLET_SPEED;
		bullets[i].x += bullets[i].changey * BULLET_SPEED;
		}
		
	}	
}

function respawn(user_tank){
	user_tank.body.x = user_tank.arm.x = 1180;
	user_tank.body.y = user_tank.arm.y = 1510;

}

function blow_up_bullet(bullet){
	bullet_explode = game.add.sprite(bullet.x,bullet.y,"bullet_explode",5);
	bullet_explode.anchor.set(0.5);
	bullet_explode_animation = bullet_explode.animations.add('explode');
	bullet_explode_animation.play(25,false)
	bullet_explode_animation.onComplete.add(function(sprite){
		sprite.destroy();
	}, this);
	
}
function render(){
	game.debug.spriteCoords(tank.body, 30, 30);
	game.debug.text(game.time.fps,30,100)
}
