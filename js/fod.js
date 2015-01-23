(function (global, document) {

    var viewModel = {
        stage: null,
        renderer: ""
    };

    var loaded = function () {
        //set up data bindings from viewModel to dom elements
        //dataBind($("#input_username"), viewModel);

        // create an new instance of a pixi stage
        viewModel.stage = new PIXI.Stage(0x66FF99);
        
        // create a renderer instance
        viewModel.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
        
        // add the renderer view element to the DOM
        document.body.appendChild(viewModel.renderer.view);
        
        requestAnimFrame( animate );
        
        // create a texture from an image path
        var texture = PIXI.Texture.fromImage("./img/sprites/bunny.png");
        // create a new Sprite using the texture
        var bunny = new PIXI.Sprite(texture);
        
        // center the sprites anchor point
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        
        // move the sprite t the center of the screen
        bunny.position.x = window.innerWidth/2;
        bunny.position.y = window.innerHeight/2;
        
        viewModel.stage.addChild(bunny);
        
        function animate() {
            requestAnimFrame( animate );
            // just for fun, lets rotate mr rabbit a little
            bunny.rotation += 0.1;
            // render the stage   
            viewModel.renderer.render(viewModel.stage);
        }
    };

    var unloading = function () {
        //set up data bindings from viewModel to dom elements
        //dataBind($("#input_username"), viewModel);



    };



    //DOMContentLoaded is more efficient than body.onload.
    document.addEventListener("DOMContentLoaded", loaded, false);
    document.addEventListener("beforeunload", unloading, false);
})(this, document);