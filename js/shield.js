class Shield extends GameObject {
    constructor(context, x, y, vx, vy, w, h) {
        super(context, x, y, vx, vy, false);
        
        this.w = w;
        this.h = h;
        this.colour = '#00C2D3';
        this.active = false;
    }

    update(gameStatus){
        this.active = true;
        if(gameStatus.gameTimers.hyperTimer > 0){
            this.colour = '#00C2D3';
        } else if(gameStatus.gameTimers.pierce > 0){
            this.colour = '#00D81A';
            velocity = 1200;
        } else {
            this.active = false;
        }
    }

    draw(){
        if(this.active){
            this.context.fillStyle = this.colour;
            this.context.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}