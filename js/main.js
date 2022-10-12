class Breakout{
    constructor(canvasID, isMobile) {
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.startingSpeed = 400;
        this.isMoblie = isMobile;

        this.gameObjects = {}
       
        this.gameStatus = {
            gameSpeed: 1/60,                    // 60 frame per second
            keysPressed: [],
            gameTimers: {
                pierceTimer: 0,
                hyperTimer: 0
            },
            gameState: null,
            score: null,
            ballCount: null,
        }

        let start, previousTimeStamp;           // for debugging fps

        this.initGame();
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)});
    }


    initGame(){
        this.gameStatus.score = 0;
        this.gameStatus.gameTimers.pierceTimer = 0;
        this.gameStatus.gameTimers.hyperTimer = 0;
        this.gameStatus.ballCount = 0;

        let ballX = this.width/2;
        let ballY = this.height-60;
        let ballRadius = 20;
        let ballAngle = Math.random() * (230 - 130) + 130;
        this.gameObjects.ball = new Ball(this.context, ballX, ballY, ballRadius, this.startingSpeed, ballAngle);

        let shieldW = this.width;
        let shieldH = 20;
        let shieldX = 0;
        let shieldY = this.height - shieldH;
        this.gameObjects.shield = new Shield(this.context, shieldX, shieldY, 0, 0, shieldW, shieldH);

        let paddleW = 180;
        let paddleH = 25;
        let paddleX = (this.width - paddleW)/2;
        let paddleY = this.height - paddleH;
        this.gameObjects.paddle = new Paddle(this.context, paddleX, paddleY, this.startingSpeed, 0, paddleW, paddleH, this.width);

        let rowX = 60;
        let rowY = 60;
        let rowW = this.width-(rowX*2);
        let rowH = 40;
        let rowV = 6;
        this.gameObjects.brickwall = new BrickWall(this.context, rowX, rowY, rowV, rowW, rowH);

        this.gameObjects.score = new Text(this.context, 16, 40, `Score: ${this.gameStatus.score}`);

        this.gameObjects.pausedMessage = new Text(this.context, this.width/2, this.height/2, `PAUSED`, `700 32px Courier New`, `#2ECC71`, `center`);
        this.gameObjects.pausedMessage.visible = false;
        this.gameObjects.subMessage = new Text(this.context, this.width/2, (this.height/2) + 40, ``, `700 24px Courier New`, `#2ECC71`, `center`);
        this.gameObjects.subMessage.visible = false;
        
        this.gameStatus.gameState = "RUNNING";
    }


    gameLoop(timestamp){

        // // counting frames per second
        // if (this.start === undefined) {
        //     this.start = timestamp;
        // }
        // const elapsed = timestamp - this.start;
        // let fps = 1000/elapsed
        // console.log(`FPS: ${fps}`);
        // this.start = timestamp

        // count down timers
        if(this.gameStatus.gameState === "RUNNING"){
            for (let timer in this.gameStatus.gameTimers) {
                if(this.gameStatus.gameTimers[timer] > 0){
                    this.gameStatus.gameTimers[timer] -= this.gameStatus.gameSpeed;
                } else {
                    this.gameStatus.gameTimers[timer] = 0;
                } 
            }
        }

        // update objects
        for (let object in this.gameObjects) {
            this.gameObjects[object].update(this.gameStatus);
        }
        this.checkCollisions();

        // draw screen
        this.clearCanvas();
        for (let object in this.gameObjects) {
            this.gameObjects[object].draw();
        }

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }


    checkCollisions(){
        if(this.gameStatus.gameState === "RUNNING"){
            let ball = this.gameObjects.ball
            let ballX = ball.x;
            let ballY = ball.y;
            let ballRadius = ball.r;

            let rows = this.gameObjects.brickwall.rows;
            let paddle = this.gameObjects.paddle;
            let shield = this.gameObjects.shield;

            /******* BRICK COLLISION *******/
            for(let i in rows){
                // if the row touches the floor, the game ends
                if((rows[i].y + rows[i].h) >= this.height){
                    this.gameOver();
                    return;
                }

                let bricks = rows[i].bricks;

                for(let j in bricks){
                    // temporary variables
                    let brickX = bricks[j].x;
                    let brickY = bricks[j].y;
                    let brickW = bricks[j].w;
                    let brickH = bricks[j].h;
                    let edgeX = ballX;
                    let edgeY = ballY;

                    // find closest edge
                    if (ballX < brickX) {
                        edgeX = brickX;                     // test left edge
                    } else if (ballX > brickX + brickW) {
                        edgeX = brickX + brickW;            // right edge
                    }

                    if (ballY < brickY) {
                        edgeY = brickY;                     // top edge
                    } else if (ballY > brickY + brickH) {
                        edgeY = brickY + brickH;            // bottom edge
                    }

                    // get distance from closest edge
                    let distX = ballX - edgeX;
                    let distY = ballY - edgeY;
                    let distance = Math.sqrt( (distX*distX) + (distY*distY) );

                    // if the distance is less than the radius, collision!
                    if (distance <= ballRadius) {
                        let powerUp = bricks[j].power;

                        switch(powerUp){
                            case "pierce": 
                                this.gameStatus.gameTimers.pierceTimer = 8;
                                break;
                            case "multi": 
                                console.log(`multi`);
                                break;
                            case "hyper": 
                                this.gameStatus.gameTimers.hyperTimer = 11;
                                break;
                            default: break;
                        } 

                        // destroy brick
                        this.gameObjects.brickwall.rows[i].bricks.splice(j, 1);
                        if(this.gameObjects.brickwall.rows[i].bricks.length === 0){
                            this.gameObjects.brickwall.rows.splice(i, 1);
                        }
                        
                        // update score
                        this.gameStatus.score++;
                        this.gameObjects.score.setText(`Score: ${this.gameStatus.score}`);

                        if(this.gameStatus.score % 10 === 0 && this.gameStatus.score > 0){
                            this.gameObjects.ball.speedUp();
                            this.gameObjects.paddle.speedUp();
                            this.gameObjects.brickwall.speedUp();
                        }

                        if(this.gameStatus.gameTimers.pierceTimer <= 0){
                            // ricochet ball
                            if(Math.abs(distX) <= Math.abs(distY)){
                                if(distY >= 0){
                                    this.gameObjects.ball.ceilingCollision();
                                } else {
                                    this.gameObjects.ball.floorCollision();
                                }
                            } else {
                                if(distX >= 0){
                                    this.gameObjects.ball.leftWallCollision();
                                } else {
                                    this.gameObjects.ball.rightWallCollision();
                                }
                            }
                        }
                    }
                }
            }


            /******* PADDLE COLLISION *******/
            let paddleX = paddle.x;
            let paddleY = paddle.y;
            let paddleW = paddle.w;
            let paddleH = paddle.h;
            let edgeX = ballX;
            let edgeY = ballY;

            if (ballX < paddleX) {
                edgeX = paddleX;                            // test left edge
            } else if (ballX > paddleX + paddleW) {
                edgeX = paddleX + paddleW;                  // right edge
            }

            if (ballY < paddleY) {
                edgeY = paddleY;                            // top edge
            } else if (ballY > paddleY + paddleH) {
                edgeY = paddleY + paddleH;                  // bottom edge
            }


            // get distance from closest edges
            let distX = ballX - edgeX;
            let distY = ballY - edgeY;
            let distance = Math.sqrt((distX*distX) + (distY*distY));

            if (distance <= ballRadius) {
                // get unit vector from centre of paddle to calculate dir of ball trajectory
                let oSide = paddleX + (paddleW/2) - ballX;
                let aSide = paddleY + (paddleH/2) - ballY;
                this.gameObjects.ball.a = (Math.atan(oSide/aSide)/Math.PI*180) + 180;
            } 


            /******* WALL COLLISION *******/
            if(ballX >= this.width - ballRadius) { 
                this.gameObjects.ball.rightWallCollision();
            } else if(ballX <= ballRadius) {
                this.gameObjects.ball.leftWallCollision();
            }

            if (ballY <= ballRadius) {
                this.gameObjects.ball.ceilingCollision();
            } else if(ballY >= this.height - ballRadius) {
                this.gameOver();
                return;
            }

            let shieldH = shield.h;
            if(shield.active){
                if(ballY >= this.height - ballRadius - shieldH) {
                    this.gameObjects.ball.floorCollision();
                }
            }
        }
    }


    clearCanvas(){
        this.context.clearRect(0, 0, this.width, this.height);
    }


    keyDown(keyCode){
        for (let object in this.gameObjects) {
            this.gameObjects[object].keyDown(keyCode);
        }
    }


    keyUp(keyCode){
        if(keyCode === "Space"){
            if(this.gameStatus.gameState == "RUNNING"){
                this.pauseGame();
            } else if(this.gameStatus.gameState == "PAUSED") {
                this.unpauseGame();
            } else {
                this.initGame();
            }
        } 

        if(this.gameStatus.gameState === "RUNNING"){
            for (let object in this.gameObjects) {
                this.gameObjects[object].keyUp(keyCode, this.gameStatus.gameState);
            }
        }
    }

    pauseGame(){
        this.gameStatus.gameState = "PAUSED"; 
        this.gameObjects.pausedMessage.setText("PAUSED");
        this.gameObjects.pausedMessage.visible = true;
    }

    unpauseGame(){
        this.gameStatus.gameState = "RUNNING"; 
        this.gameObjects.pausedMessage.visible = false;
        // window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)});
    }

    
    gameOver(){
        this.gameStatus.gameState = "STOPPED"; 
        this.gameObjects.pausedMessage.setText("GAME OVER");
        this.gameObjects.pausedMessage.visible = true;
        this.checkScoreboard();
    }

    async checkScoreboard() {
        let response = await this.getScoreboard();
        if(response.code === "success"){
            let scoreboard = response.scoreboard;
            let lowestScore = parseInt(scoreboard[scoreboard.length - 1].score);
            if(lowestScore < this.gameStatus.score){
                this.gameObjects.subMessage.setText("New scoreboard entry!");
                this.gameObjects.subMessage.visible = true;
            } else {
                let scoreDiff = (lowestScore+1) - this.gameStatus.score;
                this.gameObjects.subMessage.setText(`You were ${scoreDiff} points from making it on the scoreboard!`);
                this.gameObjects.subMessage.visible = true;
            }
        } else {
            this.gameObjects.subMessage.setText(response.message);
            this.gameObjects.subMessage.visible = true;
        }
    }

    async getScoreboard(){
        let response = await fetch('./php/getscoreboard.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }

    async updateScoreboard(name, score){
        let response = await fetch('./php/updateScoreboard.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }
}




/*
TODO
Features
- Scoreboard - IN PROGRESS
- Menues to navigate (state machine)
- Add multiball
- Score bonuses
- More types of brick rows (stonger bricks, gaps, strafing bricks, etc)

Bugs
- Fix ball occasionally not bouncing off bricks
- Improve controls when pausing
*/