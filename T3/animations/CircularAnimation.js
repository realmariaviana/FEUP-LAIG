class CircularAnimation extends Animation{

    /**
     * Circular animation constructor.
     * @param scene Scene to apply the animation to
     * @param id Id of the animation
     * @param time Duration of the animation
     * @param center Center of the circle followed by the animation (x,y,z)
     * @param radius Animation radius
     * @param startAng Angle at which the animation starts
     * @param rotAng Final angle of the animation (relative to the starting angle)
     * @constructor
     */
    constructor(scene, id, time, center, radius, startAng, rotAng,loop) {

        super(scene, id, time);
        this.center = center;
        this.radius = radius;
        this.startAng = startAng;
        this.rotAng = rotAng;
        this.speed = rotAng/this.time;
        this.timePasesed = 0;
        this.currentAngle =0;
        this.animationDone = false;
        this.loop=loop;
    }

    /**
     * Updates the current rotation angle of the object.
     * @param deltaTime Time delta since the last update.
     */
    update(deltaTime) {
        if(!this.animationDone){

            this.timePasesed += deltaTime;
            let partialRotation = deltaTime * this.speed;
            this.currentAngle += partialRotation;

            if(this.timePasesed>=this.time) this.animationDone = true;
        } else if(this.loop!=null) this.resetAnimation();
    }

    /**
     * Applies the transformations according to the current state of the animation.
     */
    apply(){
        if(!this.animationDone){
            this.scene.translate(this.center[0], this.center[1],this.center[2]);
            this.scene.translate(this.radius * Math.sin(this.currentAngle*Math.PI / 180), 0, this.radius * Math.cos(this.currentAngle*Math.PI / 180));
            this.scene.rotate(Math.PI / 180 *this.currentAngle,0,1,0);
        }
    }

     /**
     * Resets the animation.
     */
    resetAnimation(){
        this.timePasesed = 0;
        this.currentAngle =0;
        this.animationDone = false;
    }

}