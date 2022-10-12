class Paddle extends GameObject {
    constructor(context, x, y, vx, vy, w, h, canvasWidth) {
        super(context, x, y, vx, vy);
        
        this.w = w;
        this.h = h;
        this.leftPressed = false;
        this.rightPressed = false;
        this.canvasWidth = canvasWidth;
    }

    update(gameStatus){
        if(gameStatus.gameState === "RUNNING"){
            if(this.leftPressed){
                this.x -= this.vx * gameStatus.gameSpeed;
                if(this.x < 0){
                    this.x = 0;
                }
            }
            if(this.rightPressed){
                this.x += this.vx * gameStatus.gameSpeed;
                if(this.x + this.w > this.canvasWidth){
                    this.x = this.canvasWidth - this.w;
                }
            }
        }
    }

    draw(){
        this.context.fillStyle = '#34495E';
        this.context.fillRect(this.x, this.y, this.w, this.h);
    }

    keyDown(keyCode){
        if(keyCode === "ArrowLeft"){
            this.leftPressed = true;
        } 
        if(keyCode === "ArrowRight"){
            this.rightPressed = true;
        }
    }

    keyUp(keyCode){
        if(keyCode === "ArrowLeft"){
            this.leftPressed = false;
        }
        if(keyCode === "ArrowRight"){
            this.rightPressed = false;
        }
    }

    speedUp(){
        this.vx+= 25;
    }
}