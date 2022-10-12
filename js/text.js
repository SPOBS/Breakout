class Text extends GameObject {
    constructor(context, x, y, text = "", font = "700 32px Courier New", colour = "#2ECC71", align = "left") {
        super(context, x, y, 0, 0);
        this.text = text;
        this.font = font;
        this.colour = colour;
        this.align = align;
    }

    draw(){
        if(this.visible){
            this.context.font = this.font;
            this.context.fillStyle = this.colour;
            this.context.textAlign = this.align;
            this.context.fillText(this.text, this.x, this.y);
        }
    }

    setText(text){
        this.text = text;
    }
}