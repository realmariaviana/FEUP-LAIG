class CircularAnimation extends Animation{

    constructor(scene, id, time, center, radius, startAng, rotAng) {
        super(scene, id, time);

        this.center = center;
        this.radius = radius;
        this.startAng = startAng;
        this.rotAng = rotAng;
        this.speed = rotAng / time;
        this.resetAnimation();
    }

    update(deltaTime, seqNum) {

        if (this.seqNum !== seqNum || this.done)
        return;

        this.seqNum = (this.seqNum + 1) % 2;

        this.timeElapsed += deltaTime / 1000;
        let rotationSlice = deltaTime / 1000 * this.speed;
        this.currentRotAng += rotationSlice;

        if (this.timeElapsed >= this.time)  // If the animation has completed the rotation
            this.done = true;
    }

    display() {
        //Translates the object to the right position.
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.translate(this.radius * Math.sin(this.startAng + this.currentRotAng), 0, this.radius * Math.cos(this.startAng + this.currentRotAng));

        //Rotates the object so it faces the right direction.
        this.scene.rotate(Math.PI / 2 + this.startAng + this.currentRotAng, 0, 1, 0);
    }

    /**
     * Resets the animation.
     */
    resetAnimation() {
        this.position = [this.radius * Math.sin(this.startAng), 0, this.radius * Math.cos(this.startAng)];
        this.done = false;
        this.timeElapsed = 0;
        this.currentRotAng = 0;
        this.seqNum = 0;
    }
}