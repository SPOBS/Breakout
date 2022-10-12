class Score extends GameObject {
    constructor(context, x, y) {
        super(context, x, y, 0, 0);
        this.text = "Score: 0";
    }

    draw(){
        this.context.font = "700 32px Courier New";
        this.context.fillStyle = "#2ECC71";
        this.context.textAlign = "left";
        this.context.fillText(this.text, this.x, this.y);
    }

    setText(text){
        this.text = text;
    }
}