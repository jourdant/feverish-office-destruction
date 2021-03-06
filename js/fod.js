/*

FEVERISH OFFICE DESTRUCTION
GLOBAL GAME JAM 2015
JEFFREY BROWN, KONNY SHIM, JOURDAN TEMPLETON

*/
(function (global, document) {

    //
    // GAME VARIABLES
    //
    var stage = null;
    var renderer = null;
    var blueprint = new PIXI.DisplayObjectContainer();
	var playerposition = {x:0, y:0};
	var winnumber = 0;
    var keystate = new Array();
    var lastkey = null;
    var lastkeyurgency = 0;
    var level = 102;
	var interjectionTicker;
	var deathTicker;

    var gameOverFlag = false;
	
	var musicIsLoaded = false;
	var introIsFinished = false;
	var musicIsPlaying = false;
	
	var SCALEFACTOR = 0.25;
    var PAGESCALE = 0.375;
    var BLUEPRINTTEXTURE = "./img/sprites/blueprint-tile.png";
	var WALLTEXTURE = "./img/sprites/wall.png";
	var DOORTEXTURE = "./img/sprites/door.png";
    var STAIRSTECTURE = "./img/sprites/stairs.png";
    var GAMEOVERTEXTURE = "./img/sprites/gameover.png";
    var FIRETEXTURE = "./img/sprites/fire.png";
    var CATTEXTURE = "./img/sprites/cat.png";
    var PLANTTEXTURE = "./img/sprites/plant.png";
    var ARMCHAIRTEXTURE = "./img/sprites/armchair.png";
    var SOFA1TEXTURE = "./img/sprites/sofa1.png";
    var SOFA2TEXTURE = "./img/sprites/sofa2.png";
    var DESK1TEXTURE = "./img/sprites/desk1.png";
    var DESK2TEXTURE = "./img/sprites/desk2.png";

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
         queue.loadFile({id:"stairstexture", src: STAIRSTECTURE});
         queue.loadFile({id:"gameovertexture", src: GAMEOVERTEXTURE});
         queue.loadFile({id:"firetexture", src: FIRETEXTURE});
         queue.loadFile({id:"cattexture", src: CATTEXTURE});
         queue.loadFile({id:"planttexture", src: PLANTTEXTURE});
         queue.loadFile({id:"armchairtexture", src: ARMCHAIRTEXTURE});
         queue.loadFile({id:"sofa1texture", src: SOFA1TEXTURE});
         queue.loadFile({id:"sofa2texture", src: SOFA2TEXTURE});
         queue.loadFile({id:"desk1texture", src: DESK1TEXTURE});
         queue.loadFile({id:"desk2texture", src: DESK2TEXTURE});

         function handleComplete() {
            console.log("Assets loaded.");
            //create webgl hook + pixi stage
            initialiseRenderer();
            //size window and set scale

            //initialise sound
            initialiseSound();

            handleResize();

            var elem = document.getElementById("game_instructions");
            elem.onclick = function() {
				if(musicIsLoaded && introIsFinished) {
					startLevel();
					elem.style.display = "none";
				}
			}
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
		SOUNDS.IVEREACHEDTHESTAIRS= "IVEREACHEDTHESTAIRS";
		SOUNDS.OHNOMORESTAIRS= "OHNOMORESTAIRS";
        SOUNDS.MUSIC= "MUSIC";
        SOUNDS.HELLO = "HELLO";
        SOUNDS.AREYOUTHERE ="AREYOUTHERE";
        SOUNDS.CAT = "CAT";
		SOUNDS.INTRO = "INTRO";
		SOUNDS.THERESSOMETHINGINTHEWAY = "THERESSOMETHINGINTHEWAY";

        createjs.Sound.registerSound("sounds/processed/help.mp3", SOUNDS.HELP);
        createjs.Sound.registerSound("sounds/processed/thatsanicefire.mp3", SOUNDS.THATSANICEFIRE);
        createjs.Sound.registerSound("sounds/processed/icantgothatway.mp3", SOUNDS.ICANTGOTHATWAY);
        createjs.Sound.registerSound("sounds/processed/itburns.mp3", SOUNDS.ITBURNS);
        createjs.Sound.registerSound("sounds/processed/okwhatshouldidonow.mp3", SOUNDS.OKWHATSHOULDIDONOW);
        createjs.Sound.registerSound("sounds/processed/ouchthatshot.mp3", SOUNDS.OUCHTHATSHOT);
        createjs.Sound.registerSound("sounds/processed/quickineedtogosomewhere.mp3", SOUNDS.QUICKINEEDTOGOSOMEWHERE);
        createjs.Sound.registerSound("sounds/processed/quickwhatshouldidonow.mp3", SOUNDS.QUICKWHATSHOULDIDONOW);
        createjs.Sound.registerSound("sounds/processed/screwthisimjustgonnataketheelevator.mp3", SOUNDS.SCREWTHIS);
		createjs.Sound.registerSound("sounds/processed/ivereachedthestairs.mp3", SOUNDS.IVEREACHEDTHESTAIRS);
		createjs.Sound.registerSound("sounds/processed/ohnomorestairs.mp3", SOUNDS.OHNOMORESTAIRS);
        createjs.Sound.registerSound("sounds/processed/elevatormusicloop.mp3", SOUNDS.MUSIC);
        createjs.Sound.registerSound("sounds/processed/hello.mp3", SOUNDS.HELLO);
        createjs.Sound.registerSound("sounds/processed/areyouthere.mp3", SOUNDS.AREYOUTHERE);
        createjs.Sound.registerSound("sounds/processed/meow.mp3", SOUNDS.CAT);
        createjs.Sound.registerSound("sounds/processed/introfinal.mp3", SOUNDS.INTRO);
        createjs.Sound.registerSound("sounds/processed/theressomethingintheway.mp3", SOUNDS.THERESSOMETHINGINTHEWAY);
		
		createjs.Sound.on("fileload", function(event) {
			if(event.id == SOUNDS.MUSIC) {
				musicIsLoaded = true;
			}
			if(event.id == SOUNDS.INTRO) {
				var instance = createjs.Sound.play(SOUNDS.INTRO);
				instance.on("complete", function() {introIsFinished = true;}, this);
			}
		})
    }

    function initialiseRenderer() {
        //create an new instance of a pixi stage
        stage = new PIXI.Stage(0x3b3383);

        //create a renderer instance
        renderer = PIXI.autoDetectRenderer(1, 1);
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

        //add the renderer view element to the DOM
        document.getElementById("game_container").appendChild(renderer.view);

        //set up the sprite container
        sprites = new PIXI.DisplayObjectContainer();

        //hook up render event to browser
        //requestAnimFrame(render);
    }

    function initialiseSprites() {
        blueprint = new PIXI.DisplayObjectContainer();
        //delete existing sprites
        while(stage.children.length > 0){ 
            var child = stage.getChildAt(0);
            stage.removeChild(child);
        }

        // tilemap container
        var size = 16;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                var sprite = createSprite(BLUEPRINTTEXTURE, x*128, y*128);
                blueprint.addChild(sprite);
            }
        }
		
		//office objects
        for (var x = 0; x < Map.WIDTH; x++) {
            for (var y = 0; y < Map.HEIGHT; y++) {
				var object = Map.spaces[x][y].object;
				if(object) {
					switch (object.type) {
						case 0:
							var sprite = createSprite(PLANTTEXTURE, x*128, y*128);
							blueprint.addChild(sprite);
							break;
						case 1:
							var sprite = createSprite(ARMCHAIRTEXTURE, x*128, y*128);
							blueprint.addChild(sprite);
							break;
						case 2:
							var sprite = createSprite(DESK1TEXTURE, x*128, y*128);
							blueprint.addChild(sprite);
							break;
						case 2.5:
							var sprite = createSprite(DESK2TEXTURE, x*128, y*128);
							blueprint.addChild(sprite);
							break;
						case 3:
							var sprite = createSprite(SOFA1TEXTURE, x*128, y*128);
							blueprint.addChild(sprite);
							break;
						case 3.5:
							var sprite = createSprite(SOFA2TEXTURE, x*128, y*128);
							blueprint.addChild(sprite);
							break;
					}
				}
			}
		}

        //adding walls to map
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

        var shortSide = Math.min(window.innerHeight, window.innerWidth);
        blueprint.scale.x = .7*shortSide / 4 / 512;
        blueprint.scale.y = .7*shortSide / 4 / 512;
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
        if (gameOverFlag == true) {return;}
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
				} else if(checkNewSpace(newSpace, {x: newx, y:newy})) {
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
				} else if(checkNewSpace(newSpace, {x: newx, y:newy})) {
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
				} else if(checkNewSpace(newSpace, {x: newx, y:newy})) {
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
				} else if(checkNewSpace(newSpace, {x: newx, y:newy})) {
					move(currentSpace, newSpace, newx, newy);
				}
                break;
        }
		if(playerposition.x == Map.WIDTH - 1 && playerposition.y == Map.HEIGHT - 1) {
			win();
		}
    }
	
	function win() {
		if(winnumber > 0) {
			createjs.Sound.play(SOUNDS.OHNOMORESTAIRS);
		}
		else {	
			createjs.Sound.play(SOUNDS.IVEREACHEDTHESTAIRS);
		}
        level--;
		winnumber++;
		if(interjectionTicker){
			clearInterval(interjectionTicker);
		}
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
	
	function theresSomethingInTheWay() {
		createjs.Sound.play(SOUNDS.THERESSOMETHINGINTHEWAY);
	}
	
	function fire() {
		if (Fire.fireLocations.length < 50) {
            createjs.Sound.play(SOUNDS.THATSANICEFIRE);
        } else if(Fire.fireLocations.length < 100) {
			createjs.Sound.play(SOUNDS.OUCHTHATSHOT);
        }else {
            createjs.Sound.play(SOUNDS.ITBURNS);
        }
	}
	
	function cat() {
		createjs.Sound.play(SOUNDS.CAT);
	}
	
	function checkNewSpace(newSpace, newSpacePosition) {
		if(newSpace.fire && !newSpace.fire.seen){
			newSpace.fire.seen = true;
			fire();
			var sprite = createSprite(FIRETEXTURE, newSpacePosition.x*128, newSpacePosition.y*128);
			blueprint.addChild(sprite);
			return false;
		} else if(newSpace.cat && !newSpace.cat.seen){ 
			newSpace.cat.seen = true;
			cat();
			var sprite = createSprite(CATTEXTURE, newSpacePosition.x*128, newSpacePosition.y*128);
			sprite.scale.x = 0.4;
			sprite.scale.y = 0.4;
			blueprint.addChild(sprite);
		} else if(newSpace.object) {
			theresSomethingInTheWay();
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
		var east = playerposition.x + 1 < Map.WIDTH ? Map.spaces[playerposition.x + 1][playerposition.y] : null;
		var south = playerposition.y + 1 < Map.HEIGHT ? Map.spaces[playerposition.x][playerposition.y + 1] : null;
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
		winnumber = 0;
		level = 102;
		if(interjectionTicker){
			clearInterval(interjectionTicker);
		}
		musicIsPlaying = false;
        createjs.Sound.stop();
		createjs.Sound.play(SOUNDS.SCREWTHIS);

        var message = createSprite(GAMEOVERTEXTURE, 0, 0);
        message.scale.x = 1;
        message.scale.y = 1;
        blueprint.addChild(message);
        gameOverFlag = true;

        var elem = document.getElementById("game_container");
        swipedetect(elem, function(swipedir1){
            console.log("[swipe] " + swipedir1.direction + " elem: " + swipedir1.elem.id);
            switch (swipedir1.direction) {
                case "none":
                    if (gameOverFlag == true) {
                        gameOverFlag = false;
                        startLevel();
                    }
                break;
            }
        });

        elem.onclick = function() {
            if (gameOverFlag == true) {
                gameOverFlag = false;
                startLevel();
            }
        }

		//setTimeout(startLevel, 5000);
	}

    function updateLevelText() {
        var elem = document.getElementById("level_text");
        elem.innerText = "Floor: " + level;
    }


    function loaded() {
        //preload assets
        initialiseAssets();

        var elem = document.getElementById("game_instructions");
        swipedetect(elem, function(swipedir1){
            console.log("[swipe] " + swipedir1.direction + " elem: " + swipedir1.elem.id);
            switch (swipedir1.direction) {
                case "none":
                    swipedir1.elem.click();
                    var elem = document.getElementById("game_border");
                    swipedetect(elem, function(swipedir){
                        console.log("[swipe] " + swipedir.direction + " elem: " + swipedir.elem.id);
                        switch (swipedir.direction) {
                            case "left":
                                handleInput({keyCode: 37});
                            break;
                            case "up":
                                handleInput({keyCode: 38});
                            break;
                            case "right":
                                handleInput({keyCode: 39});
                            break;
                            case "down":
                                handleInput({keyCode: 40});
                            break;
                            case "none":
                                swipedir.elem.click();
                            break;
                        }
                        
                    });
                break;
            }
        });
    }
	
	function startLevel() {
        updateLevelText();

        //generate map
		Map.generateMap();
		
		playerposition.x = 0;
		playerposition.y = 0;

        //create sprites
        initialiseSprites();
		
		Fire.begin(1/Math.pow(1.6, winnumber));
		
		lastkey = null;
        interjectionTicker = setInterval(checkForInterjection, 500);
		if(deathTicker) {
			clearInterval(deathTicker);
		}
		deathTicker = setInterval(checkForDeath, 1000);
		
		if(musicIsLoaded && introIsFinished && !musicIsPlaying) {
			var instance = createjs.Sound.play(SOUNDS.MUSIC, {loop:-1});
			instance.volume = 0.5;
			musicIsPlaying = true;
		}
	}

    function unloading() {
        //cleanup
    }

    function handleResize() {
        var shortSide = Math.min(window.innerHeight, window.innerWidth);
        blueprint.scale.x = .7*shortSide / 4 / 512;
        blueprint.scale.y = .7*shortSide / 4 / 512;

        var container = document.getElementById("game_container");
        container.offsetWidth = container.offsetHeight;
		
		var border = document.getElementById("game_border");
		var canvas = container.children[0];

        renderer.resize(shortSide * .7, shortSide * .7);
    }

    
    function checkForInterjection() {
        if (lastkey) {
            var currentTime = new Date();
            var diff = currentTime.getTime() - lastkey.getTime()

            var seconds = Math.abs(diff / 1000);
            var sound = null;
            if (seconds > 20 && lastkeyurgency == 4) {sound = SOUNDS.HELP; lastkeyurgency++;}
            else if (seconds > 17 && lastkeyurgency == 3) { sound = SOUNDS.QUICKINEEDTOGOSOMEWHERE; lastkeyurgency++;}
            else if (seconds > 14 && lastkeyurgency == 2) { sound = SOUNDS.AREYOUTHERE; lastkeyurgency++;}
            else if (seconds > 9 && lastkeyurgency == 1) { sound = SOUNDS.HELLO; lastkeyurgency++;}
            else if (seconds > 3 && lastkeyurgency == 0) { sound = SOUNDS.OKWHATSHOULDIDONOW; lastkeyurgency++;}


            if (sound) { createjs.Sound.play(sound); }
        }
    }

    function keydown(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            if (!keystate[event.keyCode]) {
                keystate[event.keyCode] = true;
                handleInput(event);
                lastkey = new Date();
                lastkeyurgency = 0;
            }
        }
    }

    function keyup(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            keystate[event.keyCode] = false;
        }
    }

    //hook up DOM events
    document.addEventListener("DOMContentLoaded", loaded, false);
    document.addEventListener("beforeunload", unloading, false);
    window.addEventListener("keydown", keydown, false);
    window.addEventListener("keyup", keyup, false);
    window.addEventListener("resize", handleResize, false);
})(this, document);