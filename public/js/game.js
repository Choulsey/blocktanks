
var ws = new WebSocket(location.origin.replace(/^http/, 'ws'))

var server_tanks = {};

name = prompt("What is your name?");




var socket = new FancyWebSocket(ws);
socket.send("connection",{username:"kevin",message:"yo"})
socket.bind("new tank",function(data){
  alert(data.username + ' is at: x, ' + data.x + ". y, " + data.y);
});
var W = window.innerWidth;
var H =  window.innerHeight;

var game = new Phaser.Game(W,H,Phaser.CANVAS,'game',{preload:preload,create:create,update:update,render:render},false,false);



var delay = 0;
var TANK_SPEED = 3;
var unit = W/2500;
var TANK_SIZE = 0.5;
var ARM_SIZE = 1.2;
var bullets = [];
var BULLET_SPEED = 8;
var BULLET_COUNTER = 0;
var FIRE_RATE = 20;
var WORLD_BOUNDS = {x:4000,y:3000};
var WORLD_PADDING = 1000
WORLD_PADDING = WORLD_PADDING * 2;



game.renderer.clearBeforeRender = false;
game.renderer.roundPixels = true;





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
	a.left  = (a.x - a.width * a.anchor.x)
    a.top  = (a.y - a.height * a.anchor.y)
    b.left  = (b.x - b.width * b.anchor.x) 
    b.top  = (b.y - b.height * b.anchor.y) 
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
	moved = false;
	if(game.input.keyboard.isDown(Phaser.Keyboard.A) && collision.l == false)
	{
		
		tank.body.x -= TANK_SPEED;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.D) && collision.r == false)
	{
		
		tank.body.x += TANK_SPEED;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.W) && collision.t == false)
	{
		
		tank.body.y -= TANK_SPEED;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.S) && collision.b == false)
	{
		
		tank.body.y += TANK_SPEED;
	}
	tank.arm.x = tank.body.x;
	tank.arm.y = tank.body.y;
	
	
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
	return new_bullet;
}

function make_server_bullet(x,y,changex,changey){
	new_bullet = game.add.sprite(x,y,'bullet');
	new_bullet.anchor.set(0.5);
	new_bullet.scale.set(TANK_SIZE);
	new_bullet.changex = changex;
	new_bullet.changey = changey;
	new_bullet.bounces = 0;
	return new_bullet;
}

function update(){
	
	move_tank(tank);
	aim_tank(tank);	
	if (game.input.mousePointer.isDown && BULLET_COUNTER > FIRE_RATE){
		socket.emit("new bullet",{
			x:tank.body.x,
			y:tank.body.y,
			changex:Math.cos(tank.arm.rotation),
			changey:Math.sin(tank.arm.rotation)
			
		});
			
		bullets.push(make_bullet(tank));
		BULLET_COUNTER = 0;	
	}
	for(i=0;i < bullets.length;i++){
		collision = false
		walls.forEach(function(wall){
			if(collides(wall,bullets[i])){
				collision = true;
				
			}	
		},this)
		if (collision){
			blow_up_bullet(bullets[i]);
			bullets[i].destroy();
			bullets.splice(i,1);
			continue
		}
		bullets[i].y -= bullets[i].changex * BULLET_SPEED;
		bullets[i].x += bullets[i].changey * BULLET_SPEED;
		}
		
	BULLET_COUNTER += 1;
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
