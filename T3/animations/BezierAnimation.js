/**
 * BezierAnimation
 * @constructor
 */
class BezierAnimation extends Animation{

    constructor(scene,id, time, controlPoints) {
      super(scene, id, time);
      this.controlPoints = controlPoints;
      this.calculateDistance();
      this.translateVec=[0,0,0];
    }

  
  calculateDistance(){
    var L2 = dividePoint(addPoints(this.controlPoints[0],this.controlPoints[1]),2);
    var H  = dividePoint(addPoints(this.controlPoints[1],this.controlPoints[2]),2);
    var L3 = dividePoint(addPoints(L2,H),2);
    var R3 = dividePoint(addPoints(this.controlPoints[2],this.controlPoints[3]),2);
    var R2 = dividePoint(addPoints(H,R3),2);
    var R1 = dividePoint(addPoints(L3,R2),2);
    
  }
  
  getPosition(deltaTime){
    let position = [];

    position[0] =
      Math.pow((1 - deltaTime), 3) * this.controlPoints[0][0] +
      3 * deltaTime * Math.pow((1 - deltaTime), 2) * this.controlPoints[1][0] +
      3 * Math.pow(deltaTime, 2) * (1 - deltaTime) * this.controlPoints[2][0] +
      Math.pow(deltaTime, 3) * this.controlPoints[3][0];
  
    position[1] =
      Math.pow((1 - deltaTime), 3) * this.controlPoints[0][1] +
      3 * deltaTime * Math.pow((1 - deltaTime), 2) * this.controlPoints[1][1] +
      3 * Math.pow(deltaTime, 2) * (1 - deltaTime) * this.controlPoints[2][1] +
      Math.pow(deltaTime, 3) * this.controlPoints[3][1];
  
    position[2] =
      Math.pow((1 - deltaTime), 3) * this.controlPoints[0][2] +
      3 * deltaTime * Math.pow((1 - deltaTime), 2) * this.controlPoints[1][2] +
      3 * Math.pow(deltaTime, 2) * (1 - deltaTime) * this.controlPoints[2][2] +
      Math.pow(deltaTime, 3) * this.controlPoints[3][2];
  
    return position;
  }
  
  /*
   * função que retorna a matriz do objeto, fundamental para a animação.
   */
  update(time){
    this.timePassed += time ;

    if(this.timePassed>=this.time){ 
        this.animationDone = true;
    }

    if(! this.animationDone){
      this.translateVec=this.getPosition(this.timePassed/this.time);
    }    
  };

  apply(){
    if(!this.animationDone){
        this.scene.translate(this.translateVec[0],this.translateVec[1],this.translateVec[2]);

    }
}
  
};  