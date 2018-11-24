/**
 * MyVehicleBody
 * @constructor
 */
class MyVehicleBody extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.initElements();
	};

	initElements(){
		let topPatchControlPoints = 
		[[1.5,0,0],[1.5,0,1.5],
		[1.5,1,0],[1.5,1,1.5],
		[-1.5,1,0],[-1.5,1,1.5],
		[-1.5,0,0],[-1.5,0,1.5]];
		let sidePatchControlPoints = 
		[[1.5,0,-1.5],[1.5,0,1.5],
		[1.5,0,-6],[1.5,0,6],
		[-1.5,0,-6],[-1.5,0,6],
		[-1.5,0,-1.5],[-1.5,0,1.5]];
		this.sidePatch = new MyPatch(this.scene,50,50, 4, 2, sidePatchControlPoints);
		this.topPatch = new MyPatch(this.scene,50,50, 4, 2, topPatchControlPoints);
		this.sidePlane = new MyPlane(this.scene,50,50);
	};

	display(){
		this.scene.pushMatrix();
		this.scene.scale(1,0.2,1);
		this.scene.translate(0,-1,3);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.sidePatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1,0.2,1);
		this.scene.translate(0,-1,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(-Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.sidePatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1,1,2);
		this.topPatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,-0.4,3);
		this.scene.scale(1,1,2);
		this.scene.rotate(Math.PI,1,0,0);
		this.topPatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(1.5,-0.2,1.5);
		this.scene.scale(1,0.6,3);
		this.scene.rotate(Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.sidePlane.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-1.5,-0.2,1.5);
		this.scene.scale(1,0.6,3);
		this.scene.rotate(-Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.sidePlane.display();
		this.scene.popMatrix();

	};

	updateTextCoords(length_s, length_t){
	};

};
