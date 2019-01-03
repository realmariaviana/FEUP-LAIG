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
                this.animation=null;
                this.scene.game.changeTurn = true;
            }
        }     
            
    }

    updateCoords(oldPos,newPos){
        this.nextPos = newPos;

        let distanceVec = [newPos[1] - oldPos[1], newPos[0] - oldPos[0]];
        let controlPoints = [[0,0,0],[distanceVec[0],0,distanceVec[1]]];
        let timeRatio = 0.8*distance(controlPoints[0],controlPoints[1]);

        this.animation = new LinearAnimation(this.scene,"",timeRatio,controlPoints);
    }

    getId(){
        return this.x*10+this.z;
    }


    /*
    this.nextPos = newPos;
        let controlPoints = [[0,0,0]];
        let distanceVec = [newPos[0] - oldPos[0], newPos[1] - oldPos[1]];
        
        let midPoint1 = [distanceVec[0]*(1/3),0.1,distanceVec[1]*(1/3)];
        let midPoint2 = [distanceVec[0]*(2/3),0.1,distanceVec[1]*(2/3)];

        controlPoints.push(midPoint1);
        controlPoints.push(midPoint2);
        controlPoints.push([distanceVec[0],0,distanceVec[1]]);

        this.animation = new BezierAnimation(this.scene,"hello",2,controlPoints);
        */
};