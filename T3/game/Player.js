class Player{

	constructor(scene,symbol,pieces,type,appearance){
        this.scene=scene;
        this.pieces = pieces;
        this.score = 0;
        this.symbol = symbol;
        this.type=type;
        this.capturedPieces=0;
        this.pieceTemplate = new Piece(this.scene,0,0,appearance);
        this.capturedPiecesArray = [];
    }

    updatePieces(currentPieces){
        this.pieces=currentPieces;
    }

    updateScore(capturedPieces){
        this.score=capturedPieces;
    }

    addCapturedPiece(piece){
        this.capturedPieces++;
        this.capturedPiecesArray.push(piece);
    }

    getCapturedCoords(z){
        let x;
        if(this.addCapturedPiece.symbol == 2) x = 1;
        else x = -1;
        if(z<10){
            return [this.capturedPiecesArray[i].x,11+this.capturedPiecesArray[i].z];
        }else if(z<20){
            return [this.capturedPiecesArray[i].x+x*2,11+this.capturedPiecesArray[i].z];
        }else{
            return [this.capturedPiecesArray[i].x+3*x,11+this.capturedPiecesArray[i].z];
        }
    }

    getCapturedCoords(){

        let x,z;

        if(this.symbol==2){
            x = 12+Math.floor(this.capturedPieces/10);
            z = 10-this.capturedPieces%10;
        }else{
            x = -2-Math.floor(this.capturedPieces/10);
            z = this.capturedPieces%10;
        }

        return [x,z];
    }

    displayCapturedPieces(){

        let x,z;

        for(let i=0; i<this.capturedPiecesArray.length; i++){
            this.scene.pushMatrix();
            if(!this.capturedPiecesArray[i].animation){
                this.scene.translate(this.capturedPiecesArray[i].x,0,this.capturedPiecesArray[i].z);
            }   
            this.capturedPiecesArray[i].display();
            this.scene.popMatrix();
        }
    }

    
    
};