(function (global, document) {

    //
    // GAME VARIABLES
    //
    var stage = null;
    var renderer = null;
	var playerposition = {x:0, y:0};
	
	var SCALEFACTOR = 0.25;
    var PAGESCALE = 0.375;
    var BLUEPRINTTEXTURE = "./img/sprites/blueprint-tile.png";
	var WALLTEXTURE = "./img/sprites/wall.png";
	var DOORTEXTURE = "./img/sprites/door.png";
    var STAIRSTECTURE = "./img/sprites/stairs.png";

    var SOUNDS = {};

    //
    // INITIALISERS
    //
    function initialiseAssets() {
         var queue = new createjs.LoadQueue();
         queue.on("complete", handleComplete, this);
         queue.loadFile({id:"blueprinttexture", src: BLUEPRINTTEXTURE});
         queue.loadFile({id:"walltexture", src: WALLTEXTURE});
         queue.loadFile({id:"doortexture", src: DOORTEXTURE});
         
         function handleComplete() {
            console.log("Assets loaded.");
            //create webgl hook + pixi stage
            initialiseRenderer();
            startLevel();
             /*createjs.Sound.play("sound");
             var image = queue.getResult("myImage");
             document.body.appendChild(image);*/
         }
    }

    function initialiseSound() {
        SOUNDS.THATSANICEFIRE = "THATSANICEFIRE";
        SOUNDS.HELP = "HELP";
        SOUNDS.ICANTGOTHATWAY = "ICANTGOTHATWAY";
        SOUNDS.ITBURNS = "ITBURNS";
        SOUNDS.OKWHATSHOULDIDONOW = "OKWHATSHOULDIDONOW";
        SOUNDS.OUCHTHATSHOT = "OUCHTHATSHOT";
        SOUNDS.QUICKINEEDTOGOSOMEWHERE = "QUICKINEEDTOGOSOMEWHERE";
        SOUNDS.QUICKWHATSHOULDIDONOW = "QUICKWHATSHOULDIDONOW";
        SOUNDS.SCREWTHIS = "SCREWTHIS";

        createjs.Sound.registerSound("sounds/processed/help.mp3", SOUNDS.HELP);
        createjs.Sound.registerSound("sounds/processed/thatsanicefire.mp3", SOUNDS.THATSANICEFIRE);
        createjs.Sound.registerSound("sounds/processed/icantgothatway.mp3", SOUNDS.ICANTGOTHATWAY);
        createjs.Sound.registerSound("sounds/processed/itburns.mp3", SOUNDS.ITBURNS);
        createjs.Sound.registerSound("sounds/processed/okwhatshouldidonow.mp3", SOUNDS.OKWHATSHOULDIDONOW);
        createjs.Sound.registerSound("sounds/processed/ouchthatshot.mp3", SOUNDS.OUCHTHATSHOT);
        createjs.Sound.registerSound("sounds/processed/quickineedtogosomewhere.mp3", SOUNDS.QUICKINEEDTOGOSOMEWHERE);
        createjs.Sound.registerSound("sounds/processed/quickwhatshouldidonow.mp3", SOUNDS.QUICKWHATSHOULDIDONOW);
        createjs.Sound.registerSound("sounds/processed/screwthisimjustgonnataketheelevator.mp3", SOUNDS.SCREWTHIS);
    }

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
                var sprite = createSprite(BLUEPRINTTEXTURE, x*128, y*128);
                blueprint.addChild(sprite)
            }
        }

        //add code here for adding walls to map
        for (var x = 0; x < Map.WIDTH; x++) {
            for (var y = 0; y < Map.HEIGHT; y++) {
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
		
		var sprite = createSprite(STAIRSTECTURE, (Map.WIDTH - 1) * 128, (Map.HEIGHT - 1) * 128);
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
		if(playerposition.x == Map.WIDTH - 1 && playerposition.y == Map.HEIGHT - 1) {
			win();
		}
    }
	
	function win() {
		alert("Win!");
		startLevel();
	}
	
	function isOutOfBounds(newx, newy) {
		return newx < 0
			|| newy < 0
			|| newx >= Map.WIDTH
			|| newy >= Map.HEIGHT
	}
	
	function iCantGoThatWay() {
		createjs.Sound.play(SOUNDS.ICANTGOTHATWAY);
	}
	
	function fire() {
		if (fire.firelocations.length < 50)
            createjs.Sound.play(SOUNDS.ITBURNS);
        } 
        else {
            createjs.Sound.play(SOUNDS.)
        }
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
	
	function checkForDeath() {
		var here = Map.spaces[playerposition.x][playerposition.y];
		var north = playerposition.y > 0 ? Map.spaces[playerposition.x][playerposition.y - 1] : null;
		var east = playerposition.x < Map.WIDTH ? Map.spaces[playerposition.x + 1][playerposition.y] : null;
		var south = playerposition.y < Map.HEIGHT ? Map.spaces[playerposition.x][playerposition.y + 1] : null;
		var west = playerposition.x > 0 ? Map.spaces[playerposition.x - 1][playerposition.y] : null;
		
		if((!north || (north.down && !north.down.door) || isObstructed(north))
			&& (!east || (here.right && !here.right.door) || isObstructed(east))
			&& (!south || (here.down && !here.down.door) || isObstructed(south))
			&& (!west || (west.right && !west.right.door) || isObstructed(west))) {
			clearInterval(deathTicker);
			gameOver();
		}
	}
	
	function isObstructed(place) {
		return place.player || place.fire || place.object;
	}
	
	function gameOver() {
		createjs.Sound.play(SOUNDS.SCREWTHIS);
		startLevel();
	}

    function loaded() {
        //size window and set scale
        handleResize();

        //preload assets
        initialiseAssets();

        //initialise sound
        initialiseSound();
    }
	
	function startLevel() {
        //generate map
		Map.generateMap();
		
		playerposition.x = 0;
		playerposition.y = 0;

        //create sprites
        initialiseSprites();
		
		Fire.begin();
		
		deathTicker = setInterval(checkForDeath, 100);
	}

    function unloading() {
        //cleanup
    }

    function handleResize() {
        var dimension = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;

    }



    //hook up DOM events
    document.addEventListener("DOMContentLoaded", loaded, false);
    document.addEventListener("beforeunload", unloading, false);
    window.addEventListener("keydown", handleInput, false);
    window.addEventListener("keydown", handleResize, false);
})(this, document);