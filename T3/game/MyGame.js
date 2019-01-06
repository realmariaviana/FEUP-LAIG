class MyGame {

	constructor(scene,scoreboard,timer,typeP1,typeP2,botDifficulty){
        this.scene=scene;
        this.timer = timer;
        this.typeP1=typeP1;
        this.typeP2=typeP2;
        this.scoreboard = scoreboard;
        this.botDifficulty=botDifficulty;
        this.pieces = [];

        this.winner = null;
        this.gameOver = false;

        this.board = new MyBoard(this.scene);

        this.board.selectedSquareId = null;

        this.whitePieceAppearance = new CGFappearance(this.scene);
        this.whitePieceAppearance.loadTexture("scenes/images/white.jpg");
        this.blackPieceAppearance = new CGFappearance(this.scene);
        this.blackPieceAppearance.loadTexture("scenes/images/black.jpg");

        this.player1 = new Player(this.scene,1,25,typeP2,this.blackPieceAppearance);
        this.player2 = new Player(this.scene,2,25,typeP1,this.whitePieceAppearance);

        this.selectedSquare = new MySelectedSquare(this.scene,60);
        this.changeTurn=false;
        this.pieceToRemove= null;
        this.previousPlayer=1;
        this.playerTurn=1;
        this.undoFlag = false;

        this.currentMove = new Move();
        this.moves=[];

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

    update(deltaTime){

        console.log(this.moves);

        for(let i=0;i<this.pieces.length;i++){
            this.pieces[i].update(deltaTime);
        }

        if(this.changeTurn){
            this.checkIfGameOver();

            if(this.gameOver) return;

            this.changePlayerTurn();

            if(this.getPlayerBySymbol(this.playerTurn).type == 1){
                this.moveAi();
            }
        }
        else this.scoreboard.update(deltaTime);
    }



    display(){

        if(this.player1 !=null && this.player2!=null)
            this.scoreboard.points=[this.player1.score,this.player2.score];

        this.scene.pushMatrix();
        this.scene.translate(0.55,0,0.55);

        if(this.selectedSquareId && getPieceWithId(this.selectedSquareId,this.pieces)){
            this.selectedSquare.display(getPositionById(this.selectedSquareId)[1]*1.1,getPositionById(this.selectedSquareId)[0]*1.09);
        }

       for(let i=0; i<this.pieces.length; i++){
            this.scene.pushMatrix();

            if(this.pieces[i].registerPick){

                this.scene.translate(this.pieces[i].z*1.1,this.pieces[i].y,this.pieces[i].x*1.1);
                if(!this.gameOver && this.getPlayerBySymbol(this.playerTurn).type==0 && !this.changeTurn)
                    this.scene.registerForPick(this.pieces[i].getId(), this.pieces[i]);

            }else if(!this.pieces[i].animation)
                this.scene.translate(this.pieces[i].x,this.pieces[i].y,this.pieces[i].z);

            this.pieces[i].display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();


    }


    userPick(id){

        this.scoreboard.lightAppearance.setTexture(this.scoreboard.regularText);

        if(id==150){
            this.changeTurn = true;
            return;
        }else if(id==200) return;

        if(this.gameOver) return;

        if(!this.selectedSquareId){
            if(!getPieceWithId(id,this.pieces)) return;

            this.selectedSquareId=id;
            this.currentMove.selectedPiece = getPieceWithId(id,this.pieces);
            return;
        }

        if(id==this.selectedSquareId)
            this.selectedSquareId=null;
        else{

            let oldPos = getPositionById(this.selectedSquareId);
            let newPos = getPositionById(id);
            let requestString = `valid_play(${oldPos[0]},${oldPos[1]},${newPos[0]},${newPos[1]},${JSON.stringify(this.boardState)},${this.playerTurn})`;

            this.currentMove.fromCoords = oldPos;
            this.currentMove.toCoords = newPos;
            this.currentMove.playerType = this.getPlayerBySymbol(this.playerTurn).type;
            this.currentMove.board=this.boardState;
            
            makeRequest(requestString,data => this.checkValidMove(data));
        }
    }


    moveAi(){
        let requestString = `get_move(${JSON.stringify(this.boardState)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn},${this.getPlayerBySymbol(this.playerTurn).type},1)`;
        makeRequest(requestString,data => this.getMove(data));
    }

    checkIfGameOver(){
        //let requestString = `game_over(${this.player1.pieces},${this.player2.pieces})`;
        //makeRequest(requestString,data => this.setGameOver(data));

        if(this.player1.capturedPieces==25){
            this.winner=1;
            this.gameOver=true;
        }else if(this.player2.capturedPieces==25){
            this.winner=2;
            this.gameOver=true;
        }
    }


    undo(){
        if(this.undoFlag)return;
        
        if(!this.currentMove.toCoords) return;

        let fromCoords = this.currentMove.fromCoords;
        let toCoords = this.currentMove.toCoords;

        let removed = getPieceWithId(this.currentMove.pieceToRemove.x*10+this.currentMove.pieceToRemove.z,this.pieces);
        let unitVec = [(fromCoords[0]-removed.x)/(fromCoords[0]-removed.x),(fromCoords[1]-removed.z)/(fromCoords[1]-removed.z)];
        removed.remove([removed.z,removed.x],[toCoords[1]*1.1,toCoords[0]*1.1],unitVec,"replaceHuman");

        this.currentMove.fromCoords=toCoords;
        this.currentMove.toCoords=fromCoords;

        let requestString1 = `move(${this.currentMove.fromCoords[0]},${this.currentMove.fromCoords[1]},${this.currentMove.toCoords[0]},${this.currentMove.toCoords[1]},${JSON.stringify(this.currentMove.board)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn})`;
        makeRequest(requestString1,data => this.move(data));

        this.undoFlag=true;

        if(this.playerTurn==1)
                    this.player1.capturedPieces--;
                else this.player2.capturedPieces--;
                
    }

    resetRemPieceCoords(){
        let pieceToReplace = getPieceWithId(this.currentMove.pieceToRemove.x*10+this.currentMove.pieceToRemove.z,this.pieces);
        this.boardState = this.currentMove.board;
        let x = pieceToReplace.x/1.1;
        let y = pieceToReplace.x/1.1;
        pieceToReplace.x=pieceToReplace.z/1.1;
        pieceToReplace.z=x;
        pieceToReplace.registerPick=true;
        this.scoreboard.unfreezeTime();
    }


    //callbacks

    initializeBoard(data){
        this.boardState = JSON.parse(data.target.response)[0];
        this.playerTurn = JSON.parse(data.target.response)[3];

        if(this.getPlayerBySymbol(this.playerTurn).type == 1){
            this.moveAi();
        }

        this.initPieces();
    }

    checkValidMove(data){

        if(JSON.parse(data.target.response)[0]=='1'){

            if(JSON.parse(data.target.response)[1]=='1') this.moveType = "kill";
            else if(this.currentMove.playerType != 0)
                this.moveType = "engageBot";

            let requestString = `move(${this.currentMove.fromCoords[0]},${this.currentMove.fromCoords[1]},${this.currentMove.toCoords[0]},${this.currentMove.toCoords[1]},${JSON.stringify(this.boardState)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn})`;
            makeRequest(requestString,data => this.move(data));
            this.scoreboard.lightAppearance.setTexture(this.scoreboard.greenText);
            setTimeout(()=>this.scoreboard.lightAppearance.setTexture(this.scoreboard.regularText), 2000);

        }else{
            console.log("invalid move\n");
            this.scoreboard.lightAppearance.setTexture(this.scoreboard.redText);
            setTimeout(()=>this.scoreboard.lightAppearance.setTexture(this.scoreboard.regularText), 2000);
            this.selectedSquareId=null;
            //this.currentMove.setNull();
        }

    }

    move(data){

        if(this.moveType=="kill"){
            this.pieceToRemove = getPieceWithId(this.currentMove.toCoords[0]*10 +this.currentMove.toCoords[1],this.pieces);
        }

        this.boardState = JSON.parse(data.target.response)[0];

        this.player1.pieces = JSON.parse(data.target.response)[1];
        this.player2.pieces = JSON.parse(data.target.response)[2];

        this.player1.score = 25-this.player2.pieces;
        this.player2.score = 25-this.player1.pieces;

        this.scoreboard.freezeTime();

        this.currentMove.selectedPiece.updateCoords(this.currentMove.fromCoords,this.currentMove.toCoords,this.moveType);

        this.selectedSquareId=null;
        this.moves.push(this.currentMove);

    }

    getMove(data){

        if(JSON.parse(data.target.response).length==1){
            this.winner = 0;
            this.gameOver=true;
            return;
        }


        this.currentMove.fromCoords=[JSON.parse(data.target.response)[0],JSON.parse(data.target.response)[1]];
        this.currentMove.toCoords=[JSON.parse(data.target.response)[2],JSON.parse(data.target.response)[3]];
        this.currentMove.board=this.boardState;
        this.currentMove.selectedPiece = getPieceWithId(this.currentMove.fromCoords[0]*10+this.currentMove.fromCoords[1],this.pieces);

        this.selectedSquareId = this.currentMove.fromCoords[0]*10+this.currentMove.fromCoords[1];

        let requestString = `valid_play(${this.currentMove.fromCoords[0]},${this.currentMove.fromCoords[1]},${this.currentMove.toCoords[0]},${this.currentMove.toCoords[1]},${JSON.stringify(this.boardState)},${this.playerTurn})`;

        makeRequest(requestString,data => this.checkValidMove(data));

    }

    moveAi(){
        let requestString = `get_move(${JSON.stringify(this.boardState)},${this.player1.pieces},${this.player2.pieces},${this.playerTurn},${this.getPlayerBySymbol(this.playerTurn).type},1)`;
        makeRequest(requestString,data => this.getMove(data));
    }

    changePlayerTurn(){
			if(this.playerTurn==1) {
					this.playerTurn=2;
					//this.scene.changeView("player2");
			}
			else {
					this.playerTurn=1;
					//this.scene.changeView("player1");
			}

        this.scoreboard.resetTimer();
        this.changeTurn=false;
        this.scoreboard.unfreezeTime();
        this.undoFlag=false;
        this.scoreboard.lightAppearance.setTexture(this.scoreboard.regularText);
    }

    //useful functions
    removePiece(){
        for(let i=0;i<this.pieces.length;i++){
            if(this.pieces[i].x==this.pieceToRemove.x && this.pieces[i].z==this.pieceToRemove.z){

                let removed = this.pieceToRemove;
                let player = this.getPlayerBySymbol(this.playerTurn);
                let unitVec = [(this.currentMove.fromCoords[0]-removed.x)/(this.currentMove.fromCoords[0]-removed.x),(this.currentMove.fromCoords[1]-removed.z)/(this.currentMove.fromCoords[1]-removed.z)];
                let type;

                if(this.currentMove.playerType == 0) type = "removeHuman";
                else type = "removeBot";

                removed.remove([removed.x,removed.z],[player.getCapturedCoords()[0],player.getCapturedCoords()[1]],unitVec,type);
                this.currentMove.pieceToRemove=removed;
                //this.scene.animatedObjects.push(removed);
                //this.pieces.splice(i,1);

                if(this.playerTurn==1)
                    this.player1.capturedPieces++;
                else this.player2.capturedPieces++;

            }
        }

        this.pieceToRemove= null;
    }

    getPlayerBySymbol(symbol){
        if(this.player1.symbol==symbol) return this.player1;
        else return this.player2;
    }

    setGameOver(data){
        if(data.target.response==0) return;
        else{
            this.winner = data.target.response;
            this.gameOver = true;
        }
    }

};
