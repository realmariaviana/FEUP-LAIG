/**
 * MyVehicleBody
 * @constructor
 */
class MyVehicleBody extends CGFobject
{	/**
	* Creates the vehicle body.
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
		let topPatchControlPoints = 
		[[-2,0,2],[-1,0,0],
		[-2,0,-2],[0,0,1],
		[0,2,0],
		[0,0,-1],[2,0,2],
		[1,0,0],[2,0,-2]];
		
		this.topPatch = new MyPatch(this.scene,30,30, 3, 3, topPatchControlPoints);
	};

	 /**
     * Displays the vehicle.
     */
	display(){

		this.scene.pushMatrix();
		this.topPatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1,1.3,1);
		this.scene.translate(0,0,0);
		this.scene.rotate(Math.PI,1,0,0);
		this.topPatch.display();
		this.scene.popMatrix();
	};

	updateTextCoords(length_s, length_t){
	};

};
