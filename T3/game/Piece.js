class Piece{

	constructor(scene,x,z, pieceAppearance){
        this.scene = scene;
        this.piece = new MyBishop(this.scene);
        this.x=x;
        this.y=0.01;
        this.z=z;
        this.pieceAppearance=pieceAppearance;
        this.animation=null;
        this.registerPick = true;
    }


    display(){
        this.scene.pushMatrix();
        if(this.animation) this.animation.apply();
        this.scene.scale(0.12,0.12,0.12);
        if(this.pieceAppearance) this.pieceAppearance.apply();
        this.piece.display();
        this.scene.popMatrix();

    }

    

    translateSymbolToColor(symbol){
        if(symbol==2){
            this.color="black";
            return this.scene.game.blackPieceAppearance;
        }
        else {
            this.color="white"; 
            return this.scene.game.whitePieceAppearance;
        }    
    }

    update(deltaTime){
        if(this.animation){
            this.animation.update(deltaTime);

            if(this.animation.animationDone){  
                this.x = this.nextPos[0];
                this.z = this.nextPos[1];
                
                if(this.animation.id=="engageBot")
                   this.scene.game.changeTurn = true;

                else if(this.animation.id=="engageHuman"){
                   this.scene.game.scoreboard.unfreezeTime();
                }

                else if(this.animation.id=="removeHuman"){
                    this.scene.game.scoreboard.unfreezeTime();
                }

                else if(this.animation.id == "replaceHuman")  
                    this.scene.game.resetRemPieceCoords();

                else if(this.animation.id=="removeBot")
                   this.scene.game.changeTurn = true;

                this.animation=null;

            }else if(this.animation.percentage>=0.55 && this.scene.game.pieceToRemove){
                this.scene.game.removePiece();
            }
        }     
            
    }

    updateCoords(oldPos,newPos,type){
        this.nextPos = newPos;

        let distanceVec = [newPos[1] - oldPos[1], newPos[0] - oldPos[0]];
        let controlPoints = [[0,0,0],[distanceVec[0],0,distanceVec[1]]];
        let timeRatio = distance(controlPoints[0],controlPoints[1]);

        this.animation = new LinearAnimation(this.scene,type,timeRatio,controlPoints);
    }


    remove(oldPos,newPos,unitVec,type){

        this.nextPos = newPos;    
        let factorz = 0.5*unitVec[1];
        let factorx = 0.5*unitVec[0];

        let oldPosDisp = [oldPos[0]*1.1,oldPos[1]*1.1];

        let controlPoints = [[oldPosDisp[1],0,oldPosDisp[0]],[oldPosDisp[1]+factorz,0,oldPosDisp[0]+factorx],[oldPosDisp[1]+factorz,3.5,oldPosDisp[0]+factorx],[this.nextPos[0],3.5,this.nextPos[1]],[this.nextPos[0],0,this.nextPos[1]]];
        let timeRatio = 0.1*(distance(controlPoints[0],controlPoints[1]) + distance(controlPoints[1],controlPoints[2])+distance(controlPoints[2],controlPoints[3])+distance(controlPoints[3],controlPoints[4]));

        this.animation = new LinearAnimation(this.scene,type,timeRatio,controlPoints);
        this.registerPick = false;
    }

    getId(){
        return this.x*10+this.z;
    }
};