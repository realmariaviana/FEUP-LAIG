/**
 * BezierAnimation
 * @constructor
 */
class BezierAnimation extends Animation{

    constructor(scene,id, time, controlPoints) {
      super(scene, id, time);
      this.controlPoints = controlPoints;
      this.calculateDistance();
  
      this.timePassed = 0;
      this.animationDone = false;
            this.translateVec=[0,0,0];
  
    }

  dividePoint(point, divisor) {
    return [point[0]/divisor, point[1]/divisor, point[2] /divisor];
  }

  addPoints(point1, point2) {
    return [point1[0] + point2[0], point1[1] + point2[1], point1[2] + point2[2]];
  }

  distance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
  }

  
  calculateDistance(){
    var L2 = this.dividePoint(this.addPoints(this.controlPoints[0],this.controlPoints[1]),2);
    var H  = this.dividePoint(this.addPoints(this.controlPoints[1],this.controlPoints[2]),2);
    var L3 = this.dividePoint(this.addPoints(L2,H),2);
    var R3 = this.dividePoint(this.addPoints(this.controlPoints[2],this.controlPoints[3]),2);
    var R2 = this.dividePoint(this.addPoints(H,R3),2);
    var R1 = this.dividePoint(this.addPoints(L3,R2),2);
  
    this.totalDistance = this.distance(this.controlPoints[0],L2) + this.distance(L2,L3) + this.distance(L3,R1) + this.distance(R1,R2) + this.distance(R2,R3) + this.distance(R3,this.controlPoints[3]);
  
  }
  
  getPosition(deltaTime,position){
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
        this.getPosition(this.timePassed/this.time,this.translateVec);
    }    
  };

  apply(){
    if(!this.animationDone){
        this.scene.translate(this.translateVec[0],this.translateVec[1],this.translateVec[2]);

    }
}
  
};  