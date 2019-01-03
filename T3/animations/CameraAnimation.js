class CameraAnimation{
    /**
     * CameraAnimation constructor
     * @param scene CGFscene where the component will be displayed
     * @param initialView position where the animation begins
     * @param finalView final position of the camara
     */
constructor (scene, initialView, finalView){
    this.scene=scene;
    this.span=1;

    //InicialPosition
    this.initialPosition=initialView[4];
    this.initialTarget= initialView[3];
  
    //FinalPosition
    this.finalPosition=finalView[4];
    this.finalTarget=finalView[3];

    this.currTime=0;
    this.done = true;

    this.currXPosition;
    this.currYPosition;
    this.currZPosition;
  
    this.currXTarget;
    this.currYTarget;
    this.currZTarget;
  
    this.vetorTarget=[this.finalTarget[0]-this.initialTarget[0],this.finalTarget[1]-this.initialTarget[1],this.finalTarget[2]-this.initialTarget[2]];
    this.vetorPosition=[this.finalPosition[0]-this.initialPosition[0],this.finalPosition[1]-this.initialPosition[1],this.finalPosition[2]-this.initialPosition[2]];
  };
  
  /**
  * Update the animation of the camera.
  * @param {number} deltaTime time since last update
  */
 updateAnimation(deltaTime){
  
    this.currTime += deltaTime;
  
    if (this.currTime >= this.span) {
        this.scene.camera.setPosition(vec3.fromValues(this.finalPosition[0],this.finalPosition[1],this.finalPosition[2]));
        this.scene.camera.setTarget(vec3.fromValues(this.finalTarget[0],this.finalTarget[1],this.finalTarget[2]));
        this.done=true;
        return;

    } else {
  
        var percentage = this.currTime / this.span;
  
        this.currXPosition=this.initialPosition[0]+percentage*this.vetorPosition[0];
        this.currYPosition=this.initialPosition[1]+percentage*this.vetorPosition[1];
        this.currZPosition=this.initialPosition[2]+percentage*this.vetorPosition[2];
  
        this.currXTarget=this.initialTarget[0]+percentage*this.vetorTarget[0];
        this.currYTarget=this.initialTarget[1]+percentage*this.vetorTarget[1];
        this.currZTarget=this.initialTarget[2]+percentage*this.vetorTarget[2];
  
  
        this.scene.camera.setPosition(vec3.fromValues(this.currXPosition,this.currYPosition,this.currZPosition));
        this.scene.camera.setTarget(vec3.fromValues(this.currXTarget,this.currYTarget,this.currZTarget));
    }
  };
}