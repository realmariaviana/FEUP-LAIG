class MyPiece extends CGFobject{

	constructor(scene,x,y){
        super(scene);
        this.base1 = new MyTorus(this.scene, 1,2,60,5);
        this.base2 = new MyTorus(this.scene, 1,1.5,60,60);
        this.cil = new MyCylinder2(this.scene, 1.8,1.2,6.5,60,60);
        this.sphere = new MySphere(this.scene,1,60,60);

        this.appearance = new CGFappearance(this.scene);
        this.x=x;
        this.y=y;
    }


    display(){
       // this.appearance.apply();

        this.scene.pushMatrix();
        this.scene.scale(1,0.5,1);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.base1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,1.5,0);
        this.scene.scale(1,1.5,1);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.base2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,3,0);
        this.scene.scale(0.8,0.5,0.8);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.base2.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(0,2.8,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.cil.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,9,0);
        this.scene.scale(0.6,0.3,0.6);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.base2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,10.5,0);
        this.scene.scale(1.8,1.8,1.8);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.sphere.display();
        this.scene.popMatrix();
    }

    updateTextCoords(length_s, length_t){

	};

};