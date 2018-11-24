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


		// this.top = [
		// 	[1, 1, 0],
		// 	[0, 0, 0],
		// 	[1, -1, 0], 

		// 	[0, 0.5, 0],
		// 	[0, 0, 2],
		// 	[0, -0.5, 0],

		// 	[-1, 1, 0],
		// 	[0, 0, 0],
		// 	[-1, -1, 0]
		// ];

		this.topPatch = new MyPatch(this.scene,9,9, 4, 2, topPatchControlPoints);
		this.sidePatch = new MyPatch(this.scene,9,9, 4, 2, sidePatchControlPoints);	
		this.sidePlane = new MyPlane(this.scene,50,50);
		this.torus = new MyTorus(this.scene, 1, 2, 32, 20);


		this.torusAppearence = new CGFappearance(this.scene);
		this.torusAppearence.loadTexture("scenes/images/black.jpeg");

		this.lightAppearence = new CGFappearance(this.scene);
		this.lightAppearence.loadTexture("scenes/images/blue.jpg");

		this.topAppearence = new CGFappearance(this.scene);
		this.topAppearence.loadTexture("scenes/images/metal.jpg");
	};

	display(){
		this.scene.pushMatrix();
		this.scene.scale(1,0.2,1);
		this.scene.translate(0,-1,3);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.topAppearence.apply();
		this.sidePatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1,0.2,1);
		this.scene.translate(0,-1,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(-Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.topAppearence.apply();
		this.sidePatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1,1,2);
		this.topAppearence.apply();
		this.topPatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,-0.4,3);
		this.scene.scale(1,1,2);
		this.scene.rotate(Math.PI,1,0,0);
		this.topAppearence.apply();
		this.topPatch.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(1.5,-0.2,1.5);
		this.scene.scale(1,0.6,3);
		this.scene.rotate(Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.topAppearence.apply();
		this.sidePlane.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-1.5,-0.2,1.5);
		this.scene.scale(1,0.6,3);
		this.scene.rotate(-Math.PI/2,0,1,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.topAppearence.apply();
		this.sidePlane.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,-0.2,1.5);
		this.scene.scale(0.9,0.3,0.9);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.torusAppearence.apply();
		this.torus.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,-0.2,1.5);
		this.scene.scale(0.95,0.1,0.95);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.lightAppearence.apply();
		this.torus.display();
		this.scene.popMatrix();
	};

	updateTextCoords(length_s, length_t){
	};

};
