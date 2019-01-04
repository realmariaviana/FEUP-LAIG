class Piece{

	constructor(scene,x,z, pieceAppearance){
        this.scene = scene;
        this.piece = new MyBishop(this.scene);
        this.x=x;
        this.y=0.1;
        this.z=z;
        this.pieceAppearance=pieceAppearance;
        this.animation=null;
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
                
                if(this.animation.id=="move")
                   {this.scene.game.changeTurn = true;}

                this.animation=null;

            }else if(this.animation.percentage>=0.55 && this.scene.game.pieceToRemove){
                console.log(this.scene.game.pieceToRemove);
                this.scene.game.removePiece();
            }
        }     
            
    }

    updateCoords(oldPos,newPos){
        this.nextPos = newPos;

        let distanceVec = [newPos[1] - oldPos[1], newPos[0] - oldPos[0]];
        let controlPoints = [[0,0,0],[distanceVec[0],0,distanceVec[1]]];
        let timeRatio = distance(controlPoints[0],controlPoints[1]);

        this.animation = new LinearAnimation(this.scene,"move",timeRatio,controlPoints);
    }


    remove(oldPos,newPos,unitVec){

        this.nextPos = newPos;    
        let factor;
        
        if(this.pieceAppearance==this.scene.game.blackPieceAppearance) factor = -0.1;
        else factor = 0.1;

        let controlPoints = [[oldPos[1],0,oldPos[0]],[oldPos[1]-0.1*unitVec[1],0,oldPos[0]-factor*unitVec[0]],[oldPos[1]-0.1*unitVec[1],3.5,oldPos[0]-factor*unitVec[0]],[this.nextPos[0],3.5,this.nextPos[1]],[this.nextPos[0],0,this.nextPos[1]]];
        let timeRatio = 0.1*(distance(controlPoints[0],controlPoints[1]) + distance(controlPoints[1],controlPoints[2])+distance(controlPoints[2],controlPoints[3])+distance(controlPoints[3],controlPoints[4]));

        this.animation = new LinearAnimation(this.scene,"capture",timeRatio,controlPoints);
    }

    getId(){
        return this.x*10+this.z;
    }
};