class LinearAnimation extends Animation {
    /**
     * Linear animation construction
     * @param scene Scene to apply the animation to.
     * @param id Animation identification string.
     * @param time Animation time span.
     * @param listRoot Control point list root.
     */
    constructor(scene, id, time, listRoot) {
        super(scene, id, time);
        this.listRoot = listRoot;
        this.totalDistance = 0;
        this.animationDone = false;
        this.vectors=[];
        this.initVectors();
        this.pointIndex=0;
        this.translateVec=[];
        this.angle = Math.PI/2;
    }

    /**
     * Initializes vectors.
     */
    initVectors(){
        let startDist = 0;
        let endDist = 0;
        let vec, p1, p2;
        let currP = [this.listRoot[0][0],this.listRoot[0][1],this.listRoot[0][2]];

        for(let i = 0; i<this.listRoot.length-1;i++){
            
            endDist += vec3.dist(this.listRoot[i],this.listRoot[i+1]);
            vec = vec3.sub(vec3.create(),this.listRoot[i+1],this.listRoot[i]);
            this.vectors.push(new AnimationVector(vec,startDist,endDist,currP));
            currP = this.listRoot[i+1];
            startDist = endDist;

        }
        this.totalDistance = endDist;
    }

     getAngle(a, b) {
        let tempA = vec3.fromValues(a[0], a[1], a[2]);
        let tempB = vec3.fromValues(b[0], b[1], b[2]);
        vec3.normalize(tempA, tempA);
        vec3.normalize(tempB, tempB);
        let cosine = vec3.dot(tempA, tempB);
        if(cosine > 1.0) {
          return 0;
        }
        else if(cosine < -1.0) {
          return Math.PI;
        } else {
          return Math.acos(cosine);
        }
    }
    /**
     * Updates the current rotation angle of the object.
     * @param deltaTime Time delta since the last update.
     */
    update(deltaTime){
    
        this.timePassed += deltaTime ;
        this.percentage = this.timePassed/this.time;
        let parcialDist = this.percentage * this.totalDistance;

        if(parcialDist>=this.totalDistance){ 
            this.animationDone = true;
        }

        if(! this.animationDone){

            for(let i = 0; i<this.vectors.length;i++){
                if(parcialDist >= this.vectors[i].startDist && parcialDist <= this.vectors[i].endDist){
                    this.pointIndex = i;
                    break; 
                } 
                 
            }
    
                this.angle = this.getAngle(this.vectors[this.pointIndex].vec, [0,0,1]);

            let ratio = (parcialDist-this.vectors[this.pointIndex].startDist)/(this.vectors[this.pointIndex].endDist-this.vectors[this.pointIndex].startDist);
            this.extraVect = [this.vectors[this.pointIndex].vec[0]*ratio,this.vectors[this.pointIndex].vec[1]*ratio,this.vectors[this.pointIndex].vec[2]*ratio];
            this.translateVec = [this.vectors[this.pointIndex].previousPoint[0]+this.extraVect[0], this.vectors[this.pointIndex].previousPoint[1]+this.extraVect[1],this.vectors[this.pointIndex].previousPoint[2]+this.extraVect[2]];

        }
}
    /**
     * Applies the transformations according to the current state of the animation.
     */
    apply(){
        if(!this.animationDone){
            this.scene.translate( this.translateVec[0],   this.translateVec[1], this.translateVec[2]);
            if(!(this.vectors[this.pointIndex].vec[0]==0 && this.vectors[this.pointIndex].vec[2]==0))
            { 
             this.scene.rotate(this.angle,0,1,0);
            }
        }
    }
}