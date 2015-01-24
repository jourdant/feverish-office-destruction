(function() {
	var WIDTH = 16;
	var HEIGHT = 16;
	var MAX_ROOMSIZE = 7;
	var MIN_ROOMSIZE = 3;
	
	Map = {};
	Map.spaces = [];
	Map.walls = [];
	for(var i = 0; i < WIDTH; i++) {
		Map.spaces[i] = [];
		Map.walls[i] = [];
	}
	Map.generateMap = function() {
		var rooms = [];
		
		for(var i = 0; i < WIDTH; i++) {
			rooms[i] = [];
		}
		
		var squaresCounter = 0;
		var roomsize = 0;
		var roomcounter = 0;
		var roomnumber = 0;
		while(squaresCounter < WIDTH * HEIGHT) {
			roomsize = generateRoomSize();
			roomnumber++;
			
			var location = findEmptyLocation(rooms);
			rooms[location.x][location.y] = roomnumber;
			roomcounter++;
			
			while(roomcounter < roomsize) {
				direction = Math.floor(Math.random() * 4);
				var found = false;
				
				for(var i = 0; i < 4; i++) {
					var newLocation = {
						x : location.x,
						y : location.y
					}
					
					if(direction == 0) {
						newLocation.x++;
					} else if (direction == 1){
						newLocation.y++;
					} else if (direction == 2){
						newLocation.x--;
					} else if (direction == 3){
						newLocation.y--;
					}
					
					if(newLocation.x < WIDTH 
						&& newLocation.x >= 0 
						&& newLocation.y < HEIGHT 
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
	}
	
	function findEmptyLocation(rooms) {
		var j = 0;
		var k = 0;
		while (true) {
			if(!rooms[j][k]) {
				return {x:j, y:k};
			} else {
				j++;
				if(j == WIDTH) {
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
				if(array[x][y] < 10) {
					it += " ";
				}
				it += array[x][y] + " ";
			}
			console.log(it)
		}
	}
	
	function constructWalls(rooms) {
		for(var j = 0; j < WIDTH; j++) {
			for(var k = 0; k < HEIGHT; k++) {
				Map.walls[j][k] = {};
				if(j + 1 < WIDTH && rooms[j+1][k] != rooms[j][k]) {
					Map.walls[j][k].right = true;
				}
				if(k + 1 < HEIGHT && rooms[j][k+1] != rooms[j][k]) {
					Map.walls[j][k].down = true;
				}
			}
		}
	}
	
	function generateRoomSize() {
		return Math.floor(Math.random() * (MAX_ROOMSIZE - MIN_ROOMSIZE)) + MIN_ROOMSIZE;
	}
})()