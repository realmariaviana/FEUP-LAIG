class MySelectedSquare extends CGFobject{

	constructor(scene,sides){
        super(scene,sides);
        this.circle = new MyCircle(this.scene,60);
        this.appearance = new CGFappearance(this.scene);
		this.appearance.loadTexture("scenes/images/selected.jpg");
    }


    display(x,z){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.translate(x,0.01,z+0.1);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.scale(0.5,0.5,1);
        this.circle.display();
        this.scene.popMatrix();

    }

    

};