class CircularAnimation extends Animation{

    constructor(scene, id, time, center, radius, startAng, rotAng) {

        super(scene, id, time);
        this.center = center;
        this.radius = radius;
        this.startAng = startAng;
        this.rotAng = rotAng;
        this.speed = rotAng/this.time;
        this.timePasesed = 0;
        this.currentAngle = startAng;
        this.animationDone = false;
    }

    update(deltaTime) {
        if(!this.animationDone){

            this.timePasesed += deltaTime;
            let partialRotation = deltaTime * this.speed;
            this.currentAngle += partialRotation;

            if(this.timePasesed>=this.time) this.animationDone = true;
        }
    }

    apply(){
        if(!this.animationDone){
            this.scene.translate(this.center[0], this.center[1],this.center[2]);
            this.scene.translate(this.radius * Math.sin(this.currentAngle), 0, this.radius * Math.cos(this.currentAngle));
            this.scene.rotate(Math.PI / 180 *this.currentAngle,0,1,0);
        }
    }

}