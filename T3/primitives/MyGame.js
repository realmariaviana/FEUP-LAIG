class MyGame extends CGFobject{

	constructor(scene){
        super(scene);
        this.tab = new MyTab(this.scene);
        this.piece = new MyPiece(this.scene);
        this.board = [];
    }


    display(){
        this.scene.pushMatrix();
        this.scene.translate(5.28,-0.05,5.28);
        this.tab.display();
        this.scene.popMatrix();
    }

    updateTextCoords(length_s, length_t){

	};

};