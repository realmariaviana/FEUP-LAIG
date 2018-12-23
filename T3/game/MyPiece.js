class MyPiece extends CGFobject{

	constructor(scene,x,z, colour){
        super(scene);
        this.piece = new Piece(this.scene);
        this.appearance = new CGFappearance(this.scene);
        this.x=x;
        this.y=0.1;
        this.z=z;
        this.colour=colour;

        if(this.colour == "white"){
            this.pieceAppearance = new CGFappearance(this.scene);
            this.pieceAppearance.loadTexture("scenes/images/white.jpg");
        }else if(this.colour == "black"){
          this.pieceAppearance = new CGFappearance(this.scene);
          this.pieceAppearance.loadTexture("scenes/images/black.jpg");
        }
    }


    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.x,this.y,this.z);
        this.scene.scale(1, 1, 1);
        this.pieceAppearance.apply();
        this.piece.display();
        this.scene.popMatrix();

    }

    updateTextCoords(length_s, length_t){

	};

};