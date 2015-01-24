(function() {
	Map = {};
	Map.WIDTH = 16;
	Map.HEIGHT = 16;
	var MAX_ROOMSIZE = 20;
	var MIN_ROOMSIZE = 16;
	
	Direction = {};
	Direction.RIGHT = 0;
	Direction.DOWN = 1;
	Direction.LEFT = 2;
	Direction.UP = 3;
	
	Map.spaces = [];
	Map.generateMap = function() {
		for(var i = 0; i < Map.WIDTH; i++) {
			Map.spaces[i] = [];
			for(var j = 0; j < Map.HEIGHT; j++) {
				Map.spaces[i][j] = {};
			}
		}
		
		var rooms = [];
		
		for(var i = 0; i < Map.WIDTH; i++) {
			rooms[i] = [];
		}
		
		var squaresCounter = 0;
		var roomsize = 0;
		var roomcounter = 0;
		var roomnumber = 0;
		while(squaresCounter < Map.WIDTH * Map.HEIGHT) {
			roomsize = generateRoomSize();
			roomnumber++;
			
			var location = findEmptyLocation(rooms);
			rooms[location.x][location.y] = roomnumber;
			roomcounter++;
			
			while(roomcounter < roomsize) {
				var direction = Math.floor(Math.random() * 4);
				var found = false;
				
				for(var i = 0; i < 4; i++) {
					var newLocation = {
						x : location.x,
						y : location.y
					}
					
					if(direction == Direction.RIGHT) {
						newLocation.x++;
					} else if (direction == Direction.DOWN){
						newLocation.y++;
					} else if (direction == Direction.LEFT){
						newLocation.x--;
					} else if (direction == Direction.UP){
						newLocation.y--;
					}
					
					if(newLocation.x < Map.WIDTH 
						&& newLocation.x >= 0 
						&& newLocation.y < Map.HEIGHT 
						&& newLocation.y >= 0
						&& !rooms[newLocation.x][newLocation.y]) {
						location = newLocation;
						found = true;
						break;
					}
					direction = (direction + 1) % 4
				}
				if(found) {
					rooms[location.x][location.y] = roomnumber;
					roomcounter++;
				} else {
					break;
				}
			}
			squaresCounter += roomcounter;
			roomcounter = 0;
		}
		log2dArray(rooms)
		constructWalls(rooms);
		
		Map.spaces[0][0].player = true;
	}
	
	function findEmptyLocation(rooms) {
		var j = 0;
		var k = 0;
		while (true) {
			if(!rooms[j][k]) {
				return {x:j, y:k};
			} else {
				j++;
				if(j == Map.WIDTH) {
					j = 0;
					k++;
				}
			}
		}
	}
	
	function log2dArray(array) {
		for(var x = 0; x < array.length; x++){
			var it = "";
			for(var y = 0; y < array[x].length;y++){
				if(array[y][x] < 10) {
					it += " ";
				}
				it += array[y][x] + " ";
			}
			console.log(it)
		}
	}
	
	function constructWalls(rooms) {
		for(var j = 0; j < Map.WIDTH; j++) {
			for(var k = 0; k < Map.HEIGHT; k++) {
				if(j + 1 < Map.WIDTH && rooms[j+1][k] != rooms[j][k]) {
					Map.spaces[j][k].right = {door: Math.random() > 0.65};
				}
				if(k + 1 < Map.HEIGHT && rooms[j][k+1] != rooms[j][k]) {
					Map.spaces[j][k].down = {door: Math.random() > 0.65};
				}
			}
		}
	}
	
	function generateRoomSize() {
		return Math.floor(Math.random() * (MAX_ROOMSIZE - MIN_ROOMSIZE)) + MIN_ROOMSIZE;
	}
})()