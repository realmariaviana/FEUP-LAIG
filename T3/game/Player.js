class Player{

	constructor(symbol,pieces){
        this.pieces = pieces;
        this.score = 0;
        this.symbol = symbol;
    }

    increaseScore(){
        this.score++;
        this.pieces--;
    }
    
    
};