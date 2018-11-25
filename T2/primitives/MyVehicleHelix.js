/**
 * MyVehicleHelixLeg
 * @constructor
 */
class MyVehicleHelix extends CGFobject
{
	constructor(scene)
	{
        super(scene);
        this.whiteAppearance = new CGFappearance(this.scene);
		this.whiteAppearance.setAmbient(0.1,0.1,0.1,1);
		this.whiteAppearance.loadTexture("../scenes/images/white.jpg");

        this.initElements();
	};

	initElements(){
        this.helix =  new MySphere(this.scene,1,60,60);

	}

	display(){
        this.scene.pushMatrix();
        this.scene.scale(0.2,0.03,0.1);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.whiteAppearance.apply();
        this.helix.display();
        this.scene.popMatrix();

	};

	updateTextCoords(length_s, length_t){
	};

};
