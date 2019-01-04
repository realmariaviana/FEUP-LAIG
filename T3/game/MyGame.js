class MyGame {

	constructor(scene,timer,typeP1,typeP2,botDifficulty){
        this.scene=scene;
        this.timer = timer;
        this.typeP1=typeP1;
        this.typeP2=typeP2;
        this.botDifficulty=botDifficulty;
        this.pieces = [];

        this.board = new MyBoard(this.scene);
        this.scoreboard = new MyScoreBoard(this.scene);

        this.board.selectedSquareId = null;

        this.whitePieceAppearance = new CGFappearance(this.scene);
        this.whitePieceAppearance.loadTexture("scenes/images/white.jpg");
        this.blackPieceAppearance = new CGFappearance(this.scene);
        this.blackPieceAppearance.loadTexture("scenes/images/black.jpg");

        this.player1 = new Player(this.scene,1,25,typeP2,this.blackPieceAppearance);
        this.player2 = new Player(this.scene,2,25,typeP1,this.whitePieceAppearance);

        this.selectedSquare = new MySelectedSquare(this.scene,60);
        this.changeTurn=false;

        makeRequest("initial_state",data => this.initializeBoard(data));
    }

    initializeBoard(data){
        this.boardState = JSON.parse(data.target.response)[0];
        this.playerTurn = JSON.parse(data.target.response)[3];
        this.updatedCoordinates=[];

        if(this.getPlayerBySymbol(this.playerTurn).type == 1){
            this.moveAi();
        }

        this.initPieces();
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
		this.scene.translate(-0.1,1.5,0);
		this.scoreboard.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.55,0,0.55);

        if(this.selectedSquareId && getPieceWithId(this.selectedSquareId,this.pieces)){
            this.selectedSquare.display(getPositionById(this.selectedSquareId)[1]*1.1,getPositionById(this.selectedSquareId)[0]*1.09);
        }

       for(let i=0; i<this.pieces.length; i++){
            this.scene.pushMatrix();
            this.scene.translate(this.pieces[i].z*1.1,this.pieces[i].y,this.pieces[i].x*1.1);
            this.scene.registerForPick(this.pieces[i].getId(), this.pieces[i]);
            this.pieces[i].display();
            this.scene.popMatrix();
        }

        this.displayCapturedPieces();

        this.scene.popMatrix();


    }

    userPick(id){

        if(!this.selectedSquareId){
            if(!getPieceWithId(id,this.pieces)) return;

            this.selectedSquareId=id;
            return;
        }

        if(id==this.selectedSquareId)
            this.selectedSquareId=null;
        else{

            let oldPos = getPositionById(this.selectedSquareId);
            let newPos = getPositionById(id);
            let requestString = `valid_play(${oldPos[0]},${oldPos[1]},${newPos[0]},${newPos[1]},${JSON.stringify(this.boardState)},${this.playerTurn})`;

            this.updatedCoordinates=newPos;
            makeRequest(requestString,data => this.checkValidMove(data));
        }
    }

    checkValidMove(data){

        if(JSON.parse(data.target.response)[0]=='1'){

            if(JSON.parse(data.target.response)[1]=='1') this.moveType = "kill";

            let oldPos = getPositionById(this.selectedSquareId);

            let requestString = `move(${oldPos[0]},${oldPos[1]},${this.updatedCoordinates[0]},${this.updatedCoordinates[1]},${JSON.stringify(this.boardState)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn})`;
            makeRequest(requestString,data => this.move(data));


        }else{
            console.log("invalid move\n");
            this.selectedSquareId=null;
        }

    }

    move(data){

        let selectedPiece = getPieceWithId(this.selectedSquareId,this.pieces);

        let oldPos = [selectedPiece.x,selectedPiece.z];
        if(this.moveType=="kill"){
            this.removePiece(this.updatedCoordinates[0],this.updatedCoordinates[1]);
        }

        this.boardState = JSON.parse(data.target.response)[0];

        this.player1.pieces = JSON.parse(data.target.response)[1];
        this.player2.pieces = JSON.parse(data.target.response)[2];

        this.player1.score = 25-this.player2.pieces;
        this.player2.score = 25-this.player1.pieces;

        this.scoreboard.freezeTime();

        selectedPiece.updateCoords(oldPos,this.updatedCoordinates);

        this.selectedSquareId=null;
    }

    getMove(data){
        let fromX = JSON.parse(data.target.response)[0];
        let fromZ = JSON.parse(data.target.response)[1];

        this.updatedCoordinates[0] = JSON.parse(data.target.response)[2];
        this.updatedCoordinates[1] = JSON.parse(data.target.response)[3];

        this.selectedSquareId = fromX*10+fromZ;

        let requestString = `valid_play(${fromX},${fromZ},${this.updatedCoordinates[0]},${this.updatedCoordinates[1]},${JSON.stringify(this.boardState)},${this.playerTurn})`;

        makeRequest(requestString,data => this.checkValidMove(data));

    }

    moveAi(){
        let requestString = `get_move(${JSON.stringify(this.boardState)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn},${this.getPlayerBySymbol(this.playerTurn).type},1)`;
        makeRequest(requestString,data => this.getMove(data));
    }

    changePlayerTurn(){
			if(this.playerTurn==1) {
					this.playerTurn=2;
					// this.scene.changeView("player2");
			}
			else {
					this.playerTurn=1;
					// this.scene.changeView("player1");
			}

        this.scoreboard.resetTimer();
        this.changeTurn=false;
        this.scoreboard.unfreezeTime();
    }

    removePiece(x,z){
        for(let i=0;i<this.pieces.length;i++){
            if(this.pieces[i].x==x && this.pieces[i].z==z){
                let removed = this.pieces[i];
                if(this.playerTurn==2) removed.remove([removed.x,removed.z],[12,10-this.player2.capturedPieces]);
                else removed.remove([removed.x,removed.z],[-2,this.player1.capturedPieces]);
                this.scene.animatedObjects.push(removed);
                this.pieces.splice(i,1);

                if(this.playerTurn==1)
                    this.player1.addCapturedPiece(removed);
                else this.player2.addCapturedPiece(removed);
            }
        }
    }

    getPlayerBySymbol(symbol){
        if(this.player1.symbol==symbol) return this.player1;
        else return this.player2;
    }

    displayCapturedPieces(){

        this.player1.displayCapturedPieces();
        this.player2.displayCapturedPieces();

    }

    update(deltaTime){

        for(let i=0;i<this.pieces.length;i++){
            this.pieces[i].update(deltaTime);
        }

        if(this.changeTurn){
            this.changePlayerTurn();

            if(this.getPlayerBySymbol(this.playerTurn).type == 1){
                this.moveAi();
            }
        }
        else this.scoreboard.update(deltaTime);
    }


};
