(function (global, document) {

    //
    // GAME VARIABLES
    //
    var stage = null;
    var renderer = null;
	var playerposition = {x:0, y:0};
	
	var SCALEFACTOR = 0.25;
    var PAGESCALE = 0.375;
	var WALLTEXTURE = "./img/sprites/wall.png";
	var DOORTEXTURE = "./img/sprites/door.png";
	var STAIRSTECTURE = "./img/sprites/stairs.png";

    //
    // INITIALISERS
    //
    function initialiseRenderer() {
        //create an new instance of a pixi stage
        stage = new PIXI.Stage(0x6699FF);

        //create a renderer instance
        renderer = PIXI.autoDetectRenderer(768, 768);
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

        //add the renderer view element to the DOM
        document.getElementById("game_container").appendChild(renderer.view);

        //set up the sprite container
        sprites = new PIXI.DisplayObjectContainer();

        //hook up render event to browser
        //requestAnimFrame(render);
    }

    function initialiseSprites() {
        // your tilemap container
        var blueprint = new PIXI.DisplayObjectContainer();
        var size = 16;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                var sprite = createSprite("./img/sprites/blueprint-tile.png", x*128, y*128);
                blueprint.addChild(sprite)
            }
        }

        //add code here for adding walls to map
        for (var x = 0; x < Map.spaces.length; x++) {
            for (var y = 0; y < Map.spaces[0].length; y++) {
				if(Map.spaces[x][y].right) {
					var texture = Map.spaces[x][y].right.door ? DOORTEXTURE : WALLTEXTURE;
					blueprint.addChild(createSprite(texture, (x + 1)*128 - (70 * SCALEFACTOR) / 2, y*128));
				}
				if(Map.spaces[x][y].down) {
					var texture = Map.spaces[x][y].down.door ? DOORTEXTURE : WALLTEXTURE;
					var sprite = createSprite(texture, x*128, (y + 1)*128 + (70 * SCALEFACTOR) / 2);
					sprite.rotation = -90 * Math.PI / 180;
					blueprint.addChild(sprite);
				}
			}
		}
		
		var sprite = createSprite(STAIRSTECTURE, (Map.spaces.length - 1) * 128, (Map.spaces[0].length - 1) * 128);
		blueprint.addChild(sprite);

        blueprint.scale.x = PAGESCALE;
        blueprint.scale.y = PAGESCALE;
        stage.addChild(blueprint);

        //render base map
        requestAnimFrame(render);
    }

    function createSprite (sprite_url, x, y) {
        var texture = PIXI.Texture.fromImage(sprite_url);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.scale.x = SCALEFACTOR;
        sprite.scale.y = SCALEFACTOR;
        return sprite;
    }


    //
    // EVENT HANDLERS
    //
    function render() {
        renderer.render(stage); 
        requestAnimFrame(render);
    }

    function handleInput(event) {
        switch (event.keyCode) {
            case 37:
                console.log("left");
				var newx = playerposition.x - 1;
				var newy = playerposition.y;
				if(isOutOfBounds(newx, newy)) {
					iCantGoThatWay();
					return;
				}
				var currentSpace = Map.spaces[playerposition.x][playerposition.y];
				var newSpace = Map.spaces[newx][newy]
				if(newSpace.right && !newSpace.right.door) {
					iCantGoThatWay();
				} else if(checkNewSpace(newSpace)) {
					move(currentSpace, newSpace, newx, newy);
				}
                break;

            case 38:
                console.log("up");
				var newx = playerposition.x;
				var newy = playerposition.y - 1;
				if(isOutOfBounds(newx, newy)) {
					iCantGoThatWay();
					return;
				}
				var currentSpace = Map.spaces[playerposition.x][playerposition.y];
				var newSpace = Map.spaces[newx][newy]
				if(newSpace.down && !newSpace.down.door) {
					iCantGoThatWay();
				} else if(checkNewSpace(newSpace)) {
					move(currentSpace, newSpace, newx, newy);
				}
                break;

            case 39:
                console.log("right");
				var newx = playerposition.x + 1;
				var newy = playerposition.y;
				if(isOutOfBounds(newx, newy)) {
					iCantGoThatWay();
					return;
				}
				var currentSpace = Map.spaces[playerposition.x][playerposition.y];
				var newSpace = Map.spaces[newx][newy]
				if(currentSpace.right && !currentSpace.right.door) {
					iCantGoThatWay();
				} else if(checkNewSpace(newSpace)) {
					move(currentSpace, newSpace, newx, newy);
				}
                break;

            case 40:
                console.log("down");
				var newx = playerposition.x;
				var newy = playerposition.y + 1;
				if(isOutOfBounds(newx, newy)) {
					iCantGoThatWay();
					return;
				}
				var currentSpace = Map.spaces[playerposition.x][playerposition.y];
				var newSpace = Map.spaces[newx][newy]
				if(currentSpace.down && !currentSpace.down.door) {
					iCantGoThatWay();
				} else if(checkNewSpace(newSpace)) {
					move(currentSpace, newSpace, newx, newy);
				}
                break;
        }
		if(playerposition.x == Map.spaces.length - 1 && playerposition.y == Map.spaces[0].length - 1) {
			win();
		}
    }
	
	function win() {
		alert("Win!");
		Map.generateMap();
		playerposition.x = 0;
		playerposition.y = 0;
		initialiseSprites();
	}
	
	function isOutOfBounds(newx, newy) {
		return newx < 0
			|| newy < 0
			|| newx >= Map.spaces.length
			|| newy >= Map.spaces[0].length
	}
	
	function iCantGoThatWay() {
		alert("I can't go that way Dave");
	}
	
	function fire() {
		alert("that's a pretty fire");
	}
	
	function cat() {
		alert("OH GOT THE CAAAAATS");
	}
	
	function checkNewSpace(newSpace) {
		if(newSpace.fire){
			fire();
			return false;
		} else if(newSpace.cat){ 
			return false;
			cat();
		} else if(newSpace.object) {
			iCantGoThatWay();
			return false;
		}
		return true;
	}
	
	function move(currentSpace, newSpace, newx, newy) {
		playerposition.x = newx;
		playerposition.y = newy;
		currentSpace.player = false;
		newSpace.player = true;
	}

    function loaded() {
		Map.generateMap();
		
        //create webgl hook + pixi stage
        initialiseRenderer();

        //create sprites
        initialiseSprites();
    }

    function unloading() {
        //cleanup
    }



    //hook up DOM events
    document.addEventListener("DOMContentLoaded", loaded, false);
    document.addEventListener("beforeunload", unloading, false);
    window.addEventListener("keydown", handleInput, false);
})(this, document);