/**
 * MyVehicle
 * @constructor
 */
class MyVehicle extends CGFobject
{	
	/**
	* Creates the vehicle body, that is represented as a drone.
	* @param scene Scene to draw the Vehicle on.
	*/
	constructor(scene)
	{
		super(scene);
		this.initElements();
	};

	/**
	/Initializes vehicle parts
	*/
	initElements(){
		this.body = new MyVehicleBody(this.scene);
		this.leg = new MyVehicleLeg(this.scene);
		this.helix = new MyVehicleHelixLeg(this.scene);

		this.whiteAppearance = new CGFappearance(this.scene);
		this.whiteAppearance.setAmbient(0.4,0.4,0.4,1);
		this.whiteAppearance.loadTexture("../scenes/images/white.jpg");

		this.metalAppearance = new CGFappearance(this.scene);
		this.metalAppearance.setAmbient(0.1,0.1,0.1,1);
		this.metalAppearance.loadTexture("../scenes/images/metal.jpg");
	}

	/**
     * Displays the vehicle.
     */
	display(){
		this.scene.pushMatrix();
		
		this.scene.pushMatrix();
		this.whiteAppearance.apply();
		this.body.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.metalAppearance.apply();
		this.leg.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(2,0,0);
		this.metalAppearance.apply();
		this.leg.display();
		this.scene.popMatrix();

		/*this.scene.pushMatrix();
		this.scene.translate(1.85,0,1.85);
		this.metalAppearance.apply();
		this.helix.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-1.85,0,1.85);
		this.whiteAppearance.apply();
		this.helix.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-1.85,0,-1.85);
		this.whiteAppearance.apply();
		this.helix.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(1.85,0,-1.85);
		this.whiteAppearance.apply();
		this.helix.display();
		this.scene.popMatrix();*/

		this.scene.popMatrix();

	};

	updateTextCoords(length_s, length_t){
	};

};
