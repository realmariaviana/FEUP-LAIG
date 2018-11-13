class LinearAnimation extends Animation {

    constructor(scene, id, time, listRoot) {
        super(scene, id, time);

        this.listRoot = listRoot;

        let point = this.listRoot;
        this.totalDistance = 0;
    
        this.speed = this.totalDistance / this.time;
        this.animationDone = false;
    }

    update(deltaTime) {

        this.timePassed += deltaTime / 1000;
    }

    apply(){}
}