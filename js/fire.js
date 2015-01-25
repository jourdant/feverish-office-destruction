/*

FEVERISH OFFICE DESTRUCTION
GLOBAL GAME JAM 2015
JEFFREY BROWN, KONNY SHIM, JOURDAN TEMPLETON

*/
(function() {
	Fire = {};
	var fireLocations = [];
	Fire.fireLocations = fireLocations;
	var firetimer;
	
	var fireTimeout = 1000;
	var fireGrowthSpeed = 0.5;
	Fire.begin = function(fireGrowthSpeed) {
		fireGrowthSpeed = fireGrowthSpeed;
		fireLocations = [];
		Fire.fireLocations = fireLocations
		do {
			var firestartX = Math.floor(Math.random() * Map.WIDTH);
			var firestartY = Math.floor(Math.random() * Map.HEIGHT);
		} while(firestartX >= 3 && firestartY >= 3 && firestartX < Map.WIDTH - 3 && firestartY < Map.HEIGHT - 3)
		
		while(firestartX == 0 && firestartY == 0) {
			firestartX = Math.floor(Math.random() * Map.WIDTH);
			firestartY = Math.floor(Math.random() * Map.HEIGHT);
		}
		
		Map.spaces[firestartX][firestartY].fire = true;
		fireLocations.push({x: firestartX, y: firestartY});
		console.log(firestartX + " " + firestartY);
		
		if(firetimer) {
			clearInterval(firetimer);
		}
		firetimer = setInterval(triggerFire, fireTimeout);
	}
	
	function triggerFire() {
		for(var i = 0; i < fireLocations.length; i++) {
			var fireLocation = fireLocations[i];
			if(Math.random() > fireGrowthSpeed) {
				var direction = Math.floor(Math.random() * 4);
				var mapSpace = Map.spaces[fireLocation.x][fireLocation.y];
				
				var newLocation = {x:fireLocation.x, y:fireLocation.y}
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
					&& !Map.spaces[newLocation.x][newLocation.y].player)
				{
					var newSpace = Map.spaces[newLocation.x][newLocation.y];
					if(newSpace.fire
						|| (direction == Direction.RIGHT && mapSpace.right && !mapSpace.right.door)
						|| (direction == Direction.DOWN && mapSpace.down && !mapSpace.down.door)
						|| (direction == Direction.LEFT && newSpace.right && !newSpace.right.door)
						|| (direction == Direction.UP && newSpace.down && !newSpace.down.door)) {
						continue;
					}
					newSpace.fire = true;
					fireLocations.push(newLocation);
					console.log(newLocation.x + " " + newLocation.y);
				}
			}
		}
	}
})();