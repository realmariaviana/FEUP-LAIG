class MyGame extends CGFobject{

	constructor(scene){
        super(scene);
        this.tab = new MyTab(this.scene);
        this.scoreboard = new MyScoreBoard(this.scene);
        this.scorePlayer1 = 54;
        this.scorePlayer2 = 44;
        this.pieces = [];
        
        //pieces for the game
        //first line
        this.pieces.push(new MyPiece(scene, 13, 4.5, "black"));
        this.pieces.push(new MyPiece(scene, 31, 4.5, "black"));
        this.pieces.push(new MyPiece(scene, 49, 4.5, "black"));
        this.pieces.push(new MyPiece(scene, 67, 4.5, "black"));
        this.pieces.push(new MyPiece(scene, 84, 4.5, "black"));

      //second line
        this.pieces.push(new MyPiece(scene, 4.5, 13, "white"));
        this.pieces.push(new MyPiece(scene, 22, 13, "white"));
        this.pieces.push(new MyPiece(scene, 40.5, 13, "white"));
        this.pieces.push(new MyPiece(scene, 58, 13, "white"));
        this.pieces.push(new MyPiece(scene, 75, 13, "white"));

        //third line
        this.pieces.push(new MyPiece(scene, 13, 22, "black"));
        this.pieces.push(new MyPiece(scene, 31, 22, "black"));
        this.pieces.push(new MyPiece(scene, 49, 22, "black"));
        this.pieces.push(new MyPiece(scene, 67, 22, "black"));
        this.pieces.push(new MyPiece(scene, 84, 22, "black"));

        //fourth line
        this.pieces.push(new MyPiece(scene, 4.5, 31, "white"));
        this.pieces.push(new MyPiece(scene, 22, 31, "white"));
        this.pieces.push(new MyPiece(scene, 40.5, 31, "white"));
        this.pieces.push(new MyPiece(scene, 58, 31, "white"));
        this.pieces.push(new MyPiece(scene, 75, 31, "white"));

        //fifth line
        this.pieces.push(new MyPiece(scene, 13, 40, "black"));
        this.pieces.push(new MyPiece(scene, 31, 40, "black"));
        this.pieces.push(new MyPiece(scene, 49, 40, "black"));
        this.pieces.push(new MyPiece(scene, 67, 40, "black"));
        this.pieces.push(new MyPiece(scene, 84, 40, "black"));

        //sixth line
        this.pieces.push(new MyPiece(scene, 4.5, 49, "white"));
        this.pieces.push(new MyPiece(scene, 22, 49, "white"));
        this.pieces.push(new MyPiece(scene, 40.5, 49, "white"));
        this.pieces.push(new MyPiece(scene, 58, 49, "white"));
        this.pieces.push(new MyPiece(scene, 75, 49, "white"));

        //seventh
        this.pieces.push(new MyPiece(scene, 13, 58, "black"));
        this.pieces.push(new MyPiece(scene, 31, 58, "black"));
        this.pieces.push(new MyPiece(scene, 49, 58, "black"));
        this.pieces.push(new MyPiece(scene, 67, 58, "black"));
        this.pieces.push(new MyPiece(scene, 84, 58, "black"));

        //eigth line
        this.pieces.push(new MyPiece(scene, 4.5, 67, "white"));
        this.pieces.push(new MyPiece(scene, 22, 67, "white"));
        this.pieces.push(new MyPiece(scene, 40.5, 67, "white"));
        this.pieces.push(new MyPiece(scene, 58, 67, "white"));
        this.pieces.push(new MyPiece(scene, 75, 67, "white"));

        //nineth
        this.pieces.push(new MyPiece(scene, 13, 76, "black"));
        this.pieces.push(new MyPiece(scene, 31, 76, "black"));
        this.pieces.push(new MyPiece(scene, 49, 76, "black"));
        this.pieces.push(new MyPiece(scene, 67, 76, "black"));
        this.pieces.push(new MyPiece(scene, 84, 76, "black"));

        //tenth line
        this.pieces.push(new MyPiece(scene, 4.5, 85, "white"));
        this.pieces.push(new MyPiece(scene, 22, 85, "white"));
        this.pieces.push(new MyPiece(scene, 40.5, 85, "white"));
        this.pieces.push(new MyPiece(scene, 58, 85, "white"));
        this.pieces.push(new MyPiece(scene, 75, 85, "white"));
        
    }


    display(){
        this.scoreboard.points=[this.scorePlayer1,this.scorePlayer2];

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

        for(let i=0; i<this.pieces.length; i++){
            this.scene.pushMatrix();
            // this.scene.registerForPick(this.pieces[i].id +100, this.pieces[i]);
            this.scene.scale(0.12,0.12,0.12);
            this.pieces[i].display();
            this.scene.popMatrix();
        }

    }

    updateTextCoords(length_s, length_t){

	};

};