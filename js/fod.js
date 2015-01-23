(function (global, document) {

    //
    // GAME VARIABLES
    //
    var stage = null;
    var renderer = null;
    var sprites = new Array();
   
    //
    // INITIALISERS
    //
    function initialiseRenderer() {
        //create an new instance of a pixi stage
        stage = new PIXI.Stage(0x6699FF);

        //create a renderer instance
        renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

        //add the renderer view element to the DOM
        document.body.appendChild(renderer.view);

        //hook up render event to browser
        requestAnimFrame(render);
    }

    function initialiseSprites() {
        var bunny = Sprite("./img/sprites/bunny.png", window.innerWidth/2, window.innerHeight/2);
        sprites[sprites.length] = bunny;
        stage.addChild(bunny);
    }

    function Sprite (sprite_url, x, y) {
        var texture = PIXI.Texture.fromImage(sprite_url);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        return sprite;
    }



    //
    // EVENT HANDLERS
    //
    function loaded() {
        //create webgl hook + pixi stage
        initialiseRenderer();

        //create sprites
        initialiseSprites();
    }

    function unloading() {
        //cleanup
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

    function render() {
        var changed = false;

        //if (Math.floor((Math.random() * 100) + 1) > 75) {
            stage.getChildAt(0).rotation += 0.1;
            changed = true;
        //}

        if (changed == true) { renderer.render(stage); }
        requestAnimFrame(render);
    }


    //hook up DOM events
    document.addEventListener("DOMContentLoaded", loaded, false);
    document.addEventListener("beforeunload", unloading, false);
    window.addEventListener("keydown", handleInput, false);
})(this, document);