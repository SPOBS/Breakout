class GameObject {
    constructor(context, x, y, vx, vy, visible = true) {
        this.context = context;     // full context of the current game state
        this.x = x;                 // object position in 2D
        this.y = y;
        this.vx = vx;               // object velocity in 2D
        this.vy = vy;
        this.visible = visible;     // object visibiity
    }

    update(gameStatus){
        // function to execute code on every frame (every 60th of a second)
    }

    draw(){
        // function to draw the object onto the canvas every frame 
    }

    keyDown(keyCode){
        // function to execute code on every button/screen press
    }

    keyUp(keyCode){
        // function to execute code on every button/screen release
    }
}