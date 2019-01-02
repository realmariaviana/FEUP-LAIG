class MyGame {

	constructor(scene, botMode,botDifficulty){
        this.scene=scene;
        this.botMode = botMode;
        this.board = new MyBoard(this.scene);
        this.scoreboard = new MyScoreBoard(this.scene);
        this.pieces = [];
        this.board.selectedSquareId = null;

        this.whitePieceAppearance = new CGFappearance(this.scene);
        this.whitePieceAppearance.loadTexture("scenes/images/white.jpg");
        this.blackPieceAppearance = new CGFappearance(this.scene);
        this.blackPieceAppearance.loadTexture("scenes/images/black.jpg");

        this.player1 = new Player(this.scene,1,25,this.whitePieceAppearance);
        this.player2 = new Player(this.scene,2,25,this.blackPieceAppearance);
        this.selectedSquare = new MySelectedSquare(this.scene,60);

        makeRequest("initial_state",data => this.initializeBoard(data));
    }

    initPieces(){

        for(let i=0; i<this.boardState.length; i++){
            for(let k=0; k<this.boardState[i].length; k++){
                if(this.boardState[i][k]=='2'){
                        let piece = new Piece(this.scene,i,k,this.blackPieceAppearance);
                        this.pieces.push(piece);
                }else if(this.boardState[i][k]=='3'){
                        let piece = new Piece(this.scene,i,k,this.whitePieceAppearance);
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
		this.scene.translate(-0.1,0,0);
		this.scoreboard.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(0.55,0,0.55);

        if(this.selectedSquareId){
            console.log(this.getPositionById(this.selectedSquareId)[0]*1.1);
            this.selectedSquare.display(this.getPositionById(this.selectedSquareId)[1]*1.1,this.getPositionById(this.selectedSquareId)[0]*1.1);
        }

       for(let i=0; i<this.pieces.length; i++){
            this.scene.pushMatrix();
            this.scene.translate(this.pieces[i].z*1.1,this.pieces[i].y,this.pieces[i].x*1.1);
            this.scene.registerForPick(this.pieces[i].getId(), this.pieces[i]);
            this.pieces[i].display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();

        this.displayCapturedPieces();

    }


    initializeBoard(data){
        this.boardState = JSON.parse(data.target.response)[0];
        this.playerTurn = JSON.parse(data.target.response)[3];
        this.initPieces();
    }

    getPieceWithId(id){
        for(let i=0;i<this.pieces.length;i++){
            if(this.pieces[i].getId()==id)
            return this.pieces[i];
        }
        return null;
    }

    getPositionById(id){
        let x = Math.floor(id/10);
        let z = id % 10;
        return [x,z];
    }

    userPick(id){

        if(!this.selectedSquareId){
            this.selectedSquareId=id;
            return;
        }
        
        if(id==this.selectedSquareId)
            this.selectedSquareId=null;
        else{
            let oldPos = this.getPositionById(this.selectedSquareId);
            let newPos = this.getPositionById(id);
            let requestString = `valid_play(${oldPos[0]},${oldPos[1]},${newPos[0]},${newPos[1]},${JSON.stringify(this.boardState)},${this.playerTurn})`;

            this.updatedCoordinates=newPos;
            makeRequest(requestString,data => this.checkValidMove(data));
        }
    }

    checkValidMove(data){

        if(JSON.parse(data.target.response)[0]=='1'){

            if(JSON.parse(data.target.response)[1]=='1') this.moveType = "kill";
            else this.moveType = "engage";   

            let oldPos = this.getPositionById(this.selectedSquareId);

            let requestString = `move(${oldPos[0]},${oldPos[1]},${this.updatedCoordinates[0]},${this.updatedCoordinates[1]},${JSON.stringify(this.boardState)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn})`;
            makeRequest(requestString,data => this.move(data));

        }else{
            console.log("invalid move\n"); 
            this.selectedSquareId=null;
        } 

    }

    move(data){
        if(this.moveType=="kill"){
            this.removePiece(this.updatedCoordinates[0],this.updatedCoordinates[1]);
        }

        this.boardState = JSON.parse(data.target.response)[0];
        
        this.player1.pieces = JSON.parse(data.target.response)[1];
        this.player2.pieces = JSON.parse(data.target.response)[2];

        this.player1.score = 25-this.player2.pieces;
        this.player2.score = 25-this.player1.pieces;

        this.playerTurn = JSON.parse(data.target.response)[3];

        this.getPieceWithId(this.selectedSquareId).updateCoords(this.updatedCoordinates[0], this.updatedCoordinates[1]);
        this.selectedSquareId=null;
    }

    removePiece(x,z){
        for(let i=0;i<this.pieces.length;i++){
            if(this.pieces[i].x==x && this.pieces[i].z==z){
                this.pieces.splice(i,1);
                if(this.playerTurn==1)
                    this.player1.addCapturedPiece();
                else this.player2.addCapturedPiece();
            }
        }
    }

    displayCapturedPieces(){
        
        this.player1.displayCapturedPieces();
        this.player2.displayCapturedPieces();
    }

    update(time){
        this.scoreboard.update(time);
    }
};