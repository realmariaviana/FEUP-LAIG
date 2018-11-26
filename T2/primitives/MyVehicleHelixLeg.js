/**
 * MyVehicleHelixLeg
 * @constructor
 */
class MyVehicleHelixLeg extends CGFobject
{
        /**
	* Creates the helixes' legs.
	* @param scene Scene to draw the legs on.
	*/
	constructor(scene)
	{
	        super(scene);
                this.initElements();
                
                this.metalAppearance = new CGFappearance(this.scene);
		this.metalAppearance.setAmbient(0.5,0.5,0.5,1);
		this.metalAppearance.loadTexture("../scenes/images/metal.jpg");
	};

        /**
	/Initializes vehicle parts
	*/
	initElements(){
        this.cil = new MyCylinder2(this.scene, 1, 1, 1, 60, 60);
        this.helix = new MyVehicleHelix(this.scene);
        this.top = new MyCircle(this.scene,40);

	}

        /**
     	* Displays the vehicle.
     	*/
	display(){
        this.scene.pushMatrix();
        this.scene.scale(0.2,0.1,0.2);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.metalAppearance.apply();
        this.cil.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.1,0);
        this.scene.scale(0.2,1,0.2);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.metalAppearance.apply();
        this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.helix.display();
        this.scene.popMatrix();


	};

	updateTextCoords(length_s, length_t){
	};

};
