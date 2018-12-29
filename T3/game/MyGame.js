class MyGame {

	constructor(scene){
        this.scene=scene;
        this.board = new MyBoard(this.scene);
        this.scoreboard = new MyScoreBoard(this.scene);
        this.pieces = [];
        this.player1 = new Player(1,25);
        this.player2 = new Player(2,25);
        
        makeRequest("initial_state",data => this.initializeBoard(data));
    

    }

    initPieces(){
        let color="black";
        let blocked =false;

        
            for(let i=0; i<this.boardState.length; i++){
                for(let k=0; k<this.boardState[i].length; k++){
                    if(this.boardState[i][k]!='0'){
                        let piece = new Piece(this.scene,i,k,this.boardState[i][k]);
                        this.pieces.push(piece);
                    }
                }
            }
        

    }


    display(){
        if(this.player1 !=null && this.player2!=null)
            this.scoreboard.points=[this.player1.score,this.player2.score];

        this.scene.pushMatrix();
        this.scene.translate(5.5,-0.05,5.5);
        this.board.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
		this.scene.translate(-0.1,3,0);
		this.scoreboard.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.55,0,0.55);

       for(let i=0; i<this.pieces.length; i++){
            this.scene.pushMatrix();
            this.scene.translate(this.pieces[i].z*1.1,this.pieces[i].y,this.pieces[i].x*1.1);
            this.pieces[i].display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();

    }


    initializeBoard(data){
        this.boardState = JSON.parse(data.target.response)[0];
        this.playerTurn = JSON.parse(data.target.response)[3];
        this.initPieces();
    }

    getPieceInPosition(x,z){
        for(let i=0;i<this.pieces.length;i++){
            if(this.pieces[i].x==x && this.pieces[i].z==z)
            return this.pieces[i];
        }
    }
};