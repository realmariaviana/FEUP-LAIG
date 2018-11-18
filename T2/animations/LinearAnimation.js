class LinearAnimation extends Animation {

    constructor(scene, id, time, listRoot) {
        super(scene, id, time);

        this.listRoot = listRoot;
        this.totalDistance = 0;
        this.animationDone = false;
        this.initDistance();
        this.currentPostion = [];
    }

    initDistance(){
        this.distances = [];
        let tempVec3;
        for(let i=0; i<this.listRoot.length -1 ;i++){
            tempVec3 = this.calculateDistance(this.listRoot[i],this.listRoot[i+1]);
            this.distances.push(tempVec3);
        }

        for(let j = 0; j<this.distances.length;j++){
            this.totalDistance+= Math.abs(this.distances[j]);
        }
        console.log(this.totalDistance);
        this.currentPostion = this.distances[0];
    }

    calculateDistance(vec1, vec2){
        let x1 = vec1[0];
        let y1 = vec1[1];
        let z1 = vec1[2];

        let x2 = vec2[0];
        let y2 = vec2[1];
        let z2 = vec2[2];

        let distX,distY, distZ;

        distX = x2-x1;
        distY = y2-y1;
        distZ = z2-z1;

        let dist = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2)+Math.pow(distZ,2));
        return dist;
    }

    update(deltaTime) {
        this.timePassed += deltaTime ;
        this.percentage = this.timePassed/this.time;
        let parcialDist = this.percentage * this.totalDistance;

        if(parcialDist>=this.totalDistance) this.animationDone = true;

        if(! this.animationDone){
            this.pointIndex=0;

            for(let i = 0; i<this.distances.length-1;i++){

                if(parcialDist > this.distances[this.pointIndex]){
                    this.pointIndex = i+1; 
                }  
            }
          
            let ratio = parcialDist/this.distances[this.pointIndex];
            this.temp = [this.listRoot[this.pointIndex][0]*ratio, this.listRoot[this.pointIndex][1]*ratio, this.listRoot[this.pointIndex][2]*ratio];
            console.log(this.listRoot[this.pointIndex]);
        }
    }

    apply(){
        this.scene.translate(this.listRoot[this.pointIndex-1][0], this.listRoot[this.pointIndex-1][1], this.listRoot[this.pointIndex][2]);
        this.scene.translate(this.temp[0],this.temp[1],this.temp[2]);
    }
}