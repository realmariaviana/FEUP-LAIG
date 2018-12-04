class MyTab extends CGFobject{

	constructor(scene){
        super(scene);
        this.tab = new MyPlane(this.scene,50,50);
        this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.4,0.4,0.4,1);
		this.appearance.loadTexture("../scenes/images/tabuleiro.png");
    }


    display(){
        this.scene.pushMatrix();
        this.scene.translate(2,0,2);
        this.scene.scale(8,1,8);
        this.appearance.apply();
        this.tab.display();
        this.scene.popMatrix();

    }

};