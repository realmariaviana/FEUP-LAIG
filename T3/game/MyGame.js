class MyGame extends CGFobject{

	constructor(scene){
        super(scene);
        this.tab = new MyTab(this.scene);
        this.piece = new MyPiece(this.scene);
        this.scoreboard = new MyScoreBoard(this.scene);
        this.board = [];
    }


    display(){
        this.scoreboard.points=[12,25];

        this.scene.pushMatrix();
        this.scene.translate(5.28,-0.05,5.28);
        this.tab.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
		this.scene.translate(-0.1,3,11.5);
		this.scene.rotate(-Math.PI,0,1,0);
		this.scene.rotate(-Math.PI/2,0,1,0);
		this.scoreboard.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.piece.display();
        this.scene.popMatrix();

    }

    updateTextCoords(length_s, length_t){

	};

};