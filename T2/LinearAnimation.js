class LinearAnimation extends Animation {

    constructor(scene, id, time, listRoot) {
        super(scene, id, time);

        this.listRoot = listRoot;

        if (!this.listRoot /*|| !this.listRoot.next*/)
            throw new Error('Control points invalid.');

        let point = this.listRoot;
        this.totalDistance = 0;
        while (point.next !== this.listRoot) {
            this.totalDistance += distance(point.value, point.next.value);
            point = point.next;
        }

        this.speed = this.totalDistance / this.time;
        this.resetAnimation();
    }

    update(deltaTime, seqNum) {
        if (this.seqNum !== seqNum || this.done)
            return;

        this.position = addPoints(this.position, multVector(this.currentDirection, this.speed * deltaTime / 1000));
        this.timeElapsed += deltaTime / 1000;

        this.seqNum = (this.seqNum + 1) % 2;

        if (this.timeElapsed >= this.timeExpected) {
            this.updateState();
        }
    }
}