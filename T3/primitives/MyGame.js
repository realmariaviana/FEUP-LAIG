class MyGame extends CGFobject{

	constructor(scene){
        super(scene);
        this.tab = new MyTab(this.scene);
        this.piece = new MyPiece(this.scene);
    }


    display(){

        this.scene.pushMatrix();
        this.scene.scale(0.1,0.1,0.1);
        this.piece.display();
        this.scene.popMatrix();
        
        this.tab.display();

    }

    updateTextCoords(length_s, length_t){

	};

};