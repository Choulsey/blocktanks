maze_generator = {
	
	new_maze: function(W,H){
		
		maze_list = [];
		
		for(i=0;i<H;i++){
			maze_row = [];
			for(t=0; t<W;t++){
				maze_row.push([1,1]);
			}
			maze_list.push(maze_row);
		}
		return maze_list;
		
	},
	
	draw_maze: function(maze_list,width,height,key,key2,x,y){
		maze_walls = game.add.group();
		for(i=0;i < maze_list.length;i++){
			maze_row = maze_list[i];

			
			for(t=0;t < maze_row.length;t++){
				top_block = game.add.sprite(x+(width*t),y + (width*i),key);
				top_block.scale.x = (width/100);
				top_block.scale.y = (height/10);
				left_block = game.add.sprite(x+(width*t),y + (width*i),key2);
				left_block.scale.x = (width/100);
				left_block.scale.y = (height/10);
				
				if (maze_list[i][t][0] == 0){
					top_block.alpha = 0;
				}
				if (maze_list[i][t][1] == 0){
					left_block.alpha = 0;
				}
				
				top_block.wall_location = {x:t,y:i,orientation:"top"};
				left_block.wall_location = {x:t,y:i,orientation:"left"};
				top_block.inputEnabled = true;
				left_block.inputEnabled = true;
				maze_walls.add(left_block);
				maze_walls.add(top_block);
						
					
					
				
				
				
				
			}
			
		}

		
		
		
		return maze_walls;
	},
	
	draw_simple_maze: function(maze_list,width,height,key,key2,x,y){
		maze_walls = game.add.group();
		for(i=0;i < maze_list.length;i++){
			maze_row = maze_list[i];

			
			for(t=0;t < maze_row.length;t++){
				top_block = game.add.sprite(x+(width*t),y + (width*i),key);
				top_block.scale.x = (width/100);
				top_block.scale.y = (height/10);
				left_block = game.add.sprite(x+(width*t),y + (width*i),key2);
				left_block.scale.x = (width/100);
				left_block.scale.y = (height/10);
				
				if (maze_list[i][t][0] == 0){
					top_block.alpha = 0;
				}
				if (maze_list[i][t][1] == 0){
					left_block.alpha = 0;
				}
				
				top_block.wall_location = {x:t,y:i,orientation:"top"};
				left_block.wall_location = {x:t,y:i,orientation:"left"};
				if (left_block.alpha == 1){
				maze_walls.add(left_block);
				}
				if (top_block.alpha == 1){
				maze_walls.add(top_block);
				}
						
					
					
				
				
				
				
			}
			
		}
		bottom_boundary = game.add.sprite(x,y + (width * maze_list.length),key);
		bottom_boundary.wall_location = {orientation:"top"};
		bottom_boundary.scale.x = maze_list[0].length;
		right_boundary = game.add.sprite(x + (width * maze_list[0].length),y,key2);
		right_boundary.wall_location = {orientation:"left"};
		right_boundary.scale.y = maze_list.length;
		
		
		console.log(bottom_boundary.y);
		console.log(bottom_boundary.x);
		
		maze_walls.add(bottom_boundary);
		maze_walls.add(right_boundary);
		return maze_walls;
	},

	update_maze: function(maze,maze_list){
		
		maze.forEach(function(wall) {
			if(wall.input.pointerOver()){
				wall.alpha = Math.abs(wall.alpha - 1);
				y = wall.wall_location.y;
				x = wall.wall_location.x;
				if(wall.wall_location.orientation == "left"){
					side = 1;
				}
				else {
					side = 0;
				}
				maze_list[y][x][side] = wall.alpha;
				
				
				
			}
		}, this);
		
	}
}



























