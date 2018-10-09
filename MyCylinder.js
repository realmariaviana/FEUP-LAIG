/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);

		this.scene = scene;
		this.slices = slices;
		this.stacks = stacks;
		this.height = height;
		this.trad = top;
		this.brad = base;



		this.baselessCylinder = new MyBaselessCylinder(scene, base, top, height, slices, stacks);

		this.top = new MyCircle(scene, slices);
		this.bottom = new MyCircle(scene, slices);

		this.initBuffers();
	};


	display(){
		this.baselessCylinder.display();

		this.scene.pushMatrix();
		this.scene.translate(0, 0, this.height);
	
		  this.scene.pushMatrix();
		  this.scene.scale(this.trad,this.trad,1);
		  this.top.display();
		  this.scene.popMatrix();
	
		this.scene.popMatrix();
	
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(-1, -1, 1);
	
	
		  this.scene.pushMatrix();
		  this.scene.scale(this.brad,this.brad,1);
		  this.bottom.display();
		  this.scene.popMatrix();
	
	
		this.scene.popMatrix();
	};

};
