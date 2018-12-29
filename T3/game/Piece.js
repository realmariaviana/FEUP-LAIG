class Piece{

	constructor(scene,x,z, symbol){
        this.scene = scene;
        this.piece = new MyBishop(this.scene);
        this.x=x;
        this.y=0.1;
        this.z=z;
        this.pieceAppearance = new CGFappearance(this.scene);
        this.translateSymbolToColor(symbol);
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
            this.pieceAppearance.loadTexture("scenes/images/black.jpg");
        }
        else {
            this.color="white"; 
            this.pieceAppearance.loadTexture("scenes/images/white.jpg");   
        }    
    }

};