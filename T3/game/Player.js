class Player{

	constructor(scene,symbol,pieces,appearance){
        this.scene=scene;
        this.pieces = pieces;
        this.score = 0;
        this.symbol = symbol;
        this.capturedPieces=0;
        console.log(this.scene.game);
        this.pieceTemplate = new Piece(this.scene,0,0,appearance);
    }

    updatePieces(currentPieces){
        this.pieces=currentPieces;
    }

    updateScore(capturedPieces){
        this.score=capturedPieces;
    }

    addCapturedPiece(){
        this.capturedPieces++;
    }

    displayCapturedPieces(){
        let initialZ = 1;
        let x;
        if(this.symbol=='2') x=12;
        else  x = -1;

        for(let i=0; i<this.capturedPieces;i++){
            this.scene.pushMatrix();
            this.scene.translate(x,0,initialZ);
            this.pieceTemplate.display();
            this.scene.popMatrix();

            initialZ++;
        }
    }
    
};