
var W = window.innerWidth;
var H =  window.innerHeight;

var game = new Phaser.Game(4000,2000,Phaser.CANVAS,'game',{preload:preload,create:create,update:update,render:render},false,false);
var down_count = 0;
function preload(){
	game.load.image("maze_wall","assets/maze_wall.png")
	game.load.image("maze wall left","assets/maze wall left.png")
}

function create(){
	game.stage.backgroundColor = "#ffffff"
	maze = [[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,0],[1,0],[1,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[0,1],[0,0],[0,0],[0,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[0,1],[0,0],[0,0],[0,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[0,1],[0,0],[0,0],[0,0],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]],[[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]]]
//	maze = maze_generator.new_maze(20,10);
	maze_group = maze_generator.draw_maze(maze,150,15,"maze_wall","maze wall left",0,0);
	
}
function update(){
	if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
		console.log(print(maze))
		
	}
	if (game.input.mousePointer.isDown && down_count > 20){
		maze_generator.update_maze(maze_group,maze);
		down_count = 0;
	}
	
	down_count += 1;
}

function print(maze){
	output = "[";
	for (y=0;y<maze.length;y++){
		output += "["
		for(x=0;x<maze[y].length;x++){
			output += "[" + maze[y][x][0] + ',' + maze[y][x][1] + ']';
			if(x!=maze[y].length - 1){
				output += ',';
			}
		}
		output += '],'
	}
	output += ']'
	return output;
}


function render(){
	
}