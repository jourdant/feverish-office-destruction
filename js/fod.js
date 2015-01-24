(function (global, document) {

    //
    // GAME VARIABLES
    //
    var stage = null;
    var renderer = null;
	
	var SCALEFACTOR = 0.375;


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
                var sprite = Sprite("./img/sprites/blueprint-tile.png", x*128, y*128);
                blueprint.addChild(sprite)
            }
        }

        //add code here for adding walls to map
        for (var x = 0; x < Map.spaces.length; x++) {
            for (var y = 0; y < Map.spaces[0].length; y++) {
				if(Map.spaces[y][x].right) {
					blueprint.addChild(Sprite("./img/sprites/wall.png", (x + 1)*128 - (70 * SCALEFACTOR) / 2, y*128));
				}
				if(Map.spaces[y][x].right) {
					var sprite = Sprite("./img/sprites/wall.png", (x + 1)*128, y*128 + (70 * SCALEFACTOR) / 2);
					sprite.rotation = -90 * Math.PI / 180;
					blueprint.addChild(sprite);
				}
			}
		}

        //var texture = new PIXI.RenderTexture();
        //texture.render(blueprint);
        //var background = new PIXI.Sprite(texture);
        blueprint.scale.x = SCALEFACTOR;
        blueprint.scale.y = SCALEFACTOR;
        stage.addChild(blueprint);

        //render base map
        requestAnimFrame(render);
    }

    function Sprite (sprite_url, x, y) {
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
                break;

            case 38:
                console.log("up");
                break;

            case 39:
                console.log("right");
                break;

            case 40:
                console.log("down");
                break;
        }
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