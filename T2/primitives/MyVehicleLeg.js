/**
 * MyVehicleLeg
 * @constructor
 */
class MyVehicleLeg extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.initElements();
	};

	initElements(){
		this.cil = new MyCylinder2(this.scene, 1, 2, 1, 60, 60);
		this.cil2 = new MyCylinder2(this.scene, 1, 1, 1, 60, 60);
	}

	display(){
		this.scene.pushMatrix();
		this.scene.translate(-1,-1,0.7);
		this.scene.scale(0.08,1,0.08);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.cil.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-1,-1,-0.7);
		this.scene.scale(0.08,1,0.08);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.cil.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-1,-0.9,-0.8);
		this.scene.scale(0.08,0.08,1.6);
		this.cil2.display();
		this.scene.popMatrix();


	};

	updateTextCoords(length_s, length_t){
	};

};
