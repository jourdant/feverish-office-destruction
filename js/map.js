(function() {
	Map = {};
	Map.WIDTH = 16;
	Map.HEIGHT = 16;
	var MAX_ROOMSIZE = 20;
	var MIN_ROOMSIZE = 16;
	var DOOR_PROBABILITY = 0.65;
	//var DOOR_PROBABILITY = 1;
	
	Direction = {};
	Direction.RIGHT = 0;
	Direction.DOWN = 1;
	Direction.LEFT = 2;
	Direction.UP = 3;
	
	Map.spaces = [];
	Map.generateMap = function() {
		do {
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
			constructObjects();
			constructWalls(rooms);
			
			Map.spaces[0][0].player = true;
		} while(!checkPossibleToComplete({x:0,y:0})[Map.WIDTH - 1][Map.HEIGHT - 1])
	}

	function constructObjects() {
		for(var i = 1; i < Map.WIDTH; i++) {
			for(var j = 0; j < Map.HEIGHT; j++) {
				if(Math.random() < 0.05) {
					Map.spaces[i][j].cat = true;
				}
				var objectRandom = Math.random();
				if(objectRandom >= 0.05 && objectRandom <= 0.10) {
					Map.spaces[i][j].object = {type: Math.floor(Math.random() * 4)};
					console.log("object at " + i + " " + j);
				}
			}
		}
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
					Map.spaces[j][k].right = {door: Math.random() > DOOR_PROBABILITY};
				}
				if(k + 1 < Map.HEIGHT && rooms[j][k+1] != rooms[j][k]) {
					Map.spaces[j][k].down = {door: Math.random() > DOOR_PROBABILITY};
				}
			}
		}
	}
	
	function generateRoomSize() {
		return Math.floor(Math.random() * (MAX_ROOMSIZE - MIN_ROOMSIZE)) + MIN_ROOMSIZE;
	}
	
	function isWallBetween(room1, room2) {
		var space1 = Map.spaces[room1.x][room1.y];
		var space2 = Map.spaces[room2.x][room2.y]
		if(room2.x == room1.x + 1) {//right
			return space1.right && !space1.right.door;
		} else if (room2.y == room1.y + 1) {//down
			return space1.down && !space1.down.door;
		} else if (room2.x == room1.x - 1) {//left
			return space2.right && !space2.right.door;
		} else { //up
			return space2.down && !space2.down.door;
		}
	}
	
	function checkPossibleToComplete (point, checkedRooms) {
		if(!checkedRooms) {
			checkedRooms = [];
			for(var i = 0; i < Map.WIDTH; i++) {
				checkedRooms.push([]);
			}
		}
		checkedRooms[point.x][point.y] = true;
		var up = {x:point.x, y:point.y - 1}
		var down = {x:point.x, y:point.y + 1}
		var left = {x:point.x - 1, y:point.y}
		var right = {x:point.x + 1, y:point.y}
		if(up.y >= 0 && !checkedRooms[up.x][up.y] && !isWallBetween(point, up) && !Map.spaces[up.x][up.y].object)
			checkPossibleToComplete(up, checkedRooms);
		if(down.y < Map.HEIGHT && !checkedRooms[down.x][down.y] && !isWallBetween(point, down) && !Map.spaces[down.x][down.y].object)
			checkPossibleToComplete(down, checkedRooms);
		if(right.x < Map.WIDTH && !checkedRooms[right.x][right.y] && !isWallBetween(point, right) && !Map.spaces[right.x][right.y].object)
			checkPossibleToComplete(right, checkedRooms);
		if(left.x >= 0 && !checkedRooms[left.x][left.y] && !isWallBetween(point, left) && !Map.spaces[left.x][left.y].object)
			checkPossibleToComplete(left, checkedRooms);
		
		return checkedRooms;
	}
})()