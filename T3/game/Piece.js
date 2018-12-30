class Piece{

	constructor(scene,x,z, pieceAppearance){
        this.scene = scene;
        this.piece = new MyBishop(this.scene);
        this.x=x;
        this.y=0.1;
        this.z=z;
        this.pieceAppearance=pieceAppearance;
    }


    display(){
        this.scene.pushMatrix();
        this.scene.scale(0.12,0.12,0.12);
        this.pieceAppearance.apply();
        this.piece.display();
        this.scene.popMatrix();

    }

    translateSymbolToColor(symbol){
        if(symbol==2){
            this.color="black";
            return this.scene.game.blackPieceAppearance;
        }
        else {
            this.color="white"; 
            return this.scene.game.whitePieceAppearance;
        }    
    }

    updateCoords(x,z){
        this.x=x;
        this.z=z;
    }

    getId(){
        return this.x*10+this.z;
    }

};