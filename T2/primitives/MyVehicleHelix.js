/**
 * MyVehicleHelixLeg
 * @constructor
 */
class MyVehicleHelix extends CGFobject
{	/**
	* Creates the vehicle helixes.
	* @param scene Scene to draw the helixes on.
	*/
	constructor(scene)
	{
        super(scene);
        this.whiteAppearance = new CGFappearance(this.scene);
	this.whiteAppearance.setAmbient(0.1,0.1,0.1,1);
	this.whiteAppearance.loadTexture("../scenes/images/white.jpg");

        this.initElements();
	};

	/**
	/Initializes vehicle parts
	*/
	initElements(){
	this.helix =  new MySphere(this.scene,1,60,60);
	this.sphere = new MySphere(this.scene,1,60,60);

	}

	/**
     	* Displays the vehicle.
     	*/
	display(){
	
	this.scene.pushMatrix();
	this.scene.translate(0.2,0.1,0);
        this.scene.scale(0.2,0.03,0.1);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.whiteAppearance.apply();
        this.helix.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
        this.scene.translate(-0.2,0.1,0);
	this.scene.scale(0.2,0.03,0.1);
	this.scene.rotate(-Math.PI,0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.whiteAppearance.apply();
        this.helix.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
        this.scene.translate(0,0.15,0);
        this.scene.scale(0.05,0.05,0.05);
        this.sphere.display();
        this.scene.popMatrix();
        

	};

	updateTextCoords(length_s, length_t){
	};

};
