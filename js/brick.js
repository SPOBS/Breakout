class BrickWall extends GameObject {
    constructor(context, rowX, rowY, rowV, rowW, rowH) {
        super(context, 0, 0, 0, 0);
        this.rows = [];
        this.currentRowTimer = 0;
        this.rowX = rowX;
        this.rowY = rowY;
        this.rowV = rowV;
        this.rowW = rowW;
        this.rowH = rowH;
        this.powerRowCounter;
        this.resetPowerUpCounter()

        for(let i = 0; i < 3; i++){
            let tempY = (i*(this.rowH+20)) + this.rowY;
            this.rows.push(new RowStandard(this.context, this.rowX, tempY, 0, this.rowV, this.rowW, this.rowH, 5-i, (this.powerRowCounter === 0)));
            this.powerRowCounter--;
        }
    }

    update(gameStatus){
        if(gameStatus.gameState === "RUNNING"){
            for(let row in this.rows){
                this.rows[row].update(gameStatus);
            }

            let newRowTimer = (this.rowH+20)/this.rowV;
            this.currentRowTimer += gameStatus.gameSpeed;
            if(this.currentRowTimer >= newRowTimer){
                //add new row
                this.addRow();
                this.currentRowTimer -= newRowTimer;
            }
        }
    }

    draw(){
        for(let row in this.rows){
            this.rows[row].draw();
        }
    }

    addRow(){
        let numberOfBricks = Math.floor(Math.random() * 5)+2;
        this.rows.push(new RowStandard(this.context, this.rowX, this.rowY, 0, this.rowV, this.rowW, this.rowH, numberOfBricks, (this.powerRowCounter === 0)));
        if(this.powerRowCounter <= 0){
            this.resetPowerUpCounter();
        } else {
            this.powerRowCounter--;
        }
    }

    speedUp(){
        this.rowV += 1;
        for(let row in this.rows){
            this.rows[row].speedUp();
        }
    }

    resetPowerUpCounter(){
        this.powerRowCounter = Math.floor(Math.random() * (7-4)) + 4;
    }
}



class BrickRow extends GameObject {
    constructor(context, x, y, vx, vy, w, h, addPowerUp) {
        super(context, x, y, vx, vy);
        this.w = w;
        this.h = h;
        this.bricks = [];
        this.addPowerUp = addPowerUp;
    }

    update(gameStatus){
        if(gameStatus.gameState === "RUNNING"){
            this.y += this.vy * gameStatus.gameSpeed;
            for(let brick in this.bricks){
                this.bricks[brick].update(gameStatus);
            }
        }
    }

    draw(){
        for(let brick in this.bricks){
            this.bricks[brick].draw();
        }
    }

    speedUp(){
        this.vy += 1;
        for(let brick in this.bricks){
            this.bricks[brick].speedUp();
        }
    }
}



class RowStandard extends BrickRow {
    constructor(context, x, y, vx, vy, w, h, n, addPowerUp) {
        super(context, x, y, vx, vy, w, h, addPowerUp);
        let brickW = (w - (15*(n-1)))/n;

        for(let i = 0; i < n; i++){
            let rng = Math.floor(Math.random() * 10);
            if(rng > 0){
                let power = "";                

                let brickX = (i*(brickW+15)) + x;
                this.bricks.push(new Brick(context, brickX, y, vx, vy, brickW, h, power));
            }
        }

        if(this.addPowerUp){
            let brickNo = Math.floor(Math.random() * this.bricks.length);
            let powerUp = Math.floor(Math.random() * 3);
            switch(powerUp){
                case 0: this.bricks[brickNo].setPowerUp("pierce"); break;
                case 1: this.bricks[brickNo].setPowerUp("pierce");  break;
                // case 1: this.bricks[brickNo].setPowerUp("multi");  break; // TODO add multiball powerup. Pierce currently taking its slot
                default: this.bricks[brickNo].setPowerUp("hyper");  break;
            } 
        }
    }

    update(gameStatus){
        if(gameStatus.gameState === "RUNNING"){
            super.update(gameStatus);
        }
    }

    draw(){
        super.draw();
    }

    speedUp(){
        super.speedUp();
    }
}


class Brick extends GameObject {
    constructor(context, x, y, vx, vy, w, h) {
        super(context, x, y, vx, vy);
        
        this.w = w;
        this.h = h;
        this.power = "";
        this.colour = "#78281F"
    }

    update(gameStatus){
        if(gameStatus.gameState === "RUNNING"){
            this.y += this.vy * gameStatus.gameSpeed;
        }
    }

    draw(){
        if(this.visible){
            this.context.fillStyle = this.colour;
            this.context.fillRect(this.x, this.y, this.w, this.h);
        }
    }

    speedUp(){
        this.vy += 1;
    }

    setPowerUp(powerUp){
        switch(powerUp){
            case "pierce": this.colour = "#00D81A"; this.power = "pierce"; break;
            case "multi": this.colour = "#9000BB"; this.power = "multi"; break;
            case "hyper": this.colour = "#00C2D3"; this.power = "hyper"; break;
            default: this.colour = "#78281F"; this.power = ""; break;
        } 
    }
}
