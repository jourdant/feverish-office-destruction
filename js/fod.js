(function (global, document) {

    //
    // GAME VARIABLES
    //
    var stage = null;
    var renderer = null;
    var sprites = null;


    //
    // INITIALISERS
    //
    function initialiseRenderer() {
        //create an new instance of a pixi stage
        stage = new PIXI.Stage(0x6699FF);

        //create a renderer instance
        renderer = PIXI.autoDetectRenderer(2048, 2048);

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
                stage.addChild(sprite)
            }
        }

        //add code here for adding walls to map. ie, 
        //foreach (var wall in walls)
        //    var s = Sprite("./img/sprites/wall.png");
        //    stage.addChild(s);

        var texture = new PIXI.RenderTexture(2048, 2048);
        texture.render(blueprint);
        var background = new PIXI.Sprite(texture);
        stage.addChild(background);

        sprites.scale.x = 0.5;
        sprites.scale.y = 0.5;
        stage.addChild(sprites);

        //render base map
        requestAnimFrame(render);
    }

    function Sprite (sprite_url, x, y) {
        var texture = PIXI.Texture.fromImage(sprite_url);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.scale.x = 0.25;
        sprite.scale.y = 0.25;
        return sprite;
    }



    //
    // EVENT HANDLERS
    //
    function render() {
        renderer.render(stage); 
        //requestAnimFrame(render);
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