class Ball extends GameObject {
    constructor(context, x, y, r, v, a) {
        super(context, x, y, 0, 0);

        this.v = v;
        this.a = a;
        this.r = r;
        this.colour = '#909497';
    }

    update(gameStatus) {
        if(gameStatus.gameState === "RUNNING"){
            let velocity = this.v;

            let powerActive = false;
            if(gameStatus.gameTimers.hyperTimer > 3){
                this.colour = '#00C2D3';
                velocity = 1200;
                powerActive = true;
            }
    
            if(gameStatus.gameTimers.pierceTimer > 0){
                this.colour = '#00D81A';
                powerActive = true;
            } 
    
            if(!powerActive){
                this.colour = '#909497';
            }

            // console.log((Math.sin(this.a*Math.PI/180) * velocity * gameStatus.gameSpeed) + ", " + (Math.cos(this.a*Math.PI/180) * velocity * gameStatus.gameSpeed));
    
            this.x += Math.sin(this.a*Math.PI/180) * velocity * gameStatus.gameSpeed
            this.y += Math.cos(this.a*Math.PI/180) * velocity * gameStatus.gameSpeed
        }
    }

    draw(){
        this.context.beginPath();
        this.context.fillStyle = this.colour;
        this.context.arc(this.x, this.y, this.r, 0, Math.PI*2);
        this.context.fill();
    }

    speedUp(){
        this.v+= 25;
    }

    floorCeilingCollision(){
        this.a = 180-this.a;
    }

    wallCollision(){
        this.a = -this.a;
    }


    ceilingCollision(){
        let angle = this.reduceAngle(this.a);
        if((angle >= 90 && angle <= 180) || (angle >= -180 && angle <= -90)){
            this.a = 180-angle;
        }
        
    }

    floorCollision(){
        let angle = this.reduceAngle(this.a);
        console.log(angle);
        if(angle >= -90 && angle <= 90){
            this.a = 180-angle;
        }
    }

    leftWallCollision(){
        let angle = this.reduceAngle(this.a);
        if((angle <= 0 && angle >= -180)){
            this.a = -angle;
        }
    }

    rightWallCollision(){
        let angle = this.reduceAngle(this.a);
        if((angle >= 0 && angle <= 180)){
            this.a = -angle;
        }
    }

    reduceAngle(angle){
        while(angle < -180 || angle > 180){
            if(angle > 180){
                angle = angle - 360
            } else {
                angle = angle + 360
            }
        }
        return angle;
    }

}