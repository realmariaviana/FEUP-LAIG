/**
 * MyVehicle
 * @constructor
 */
class MyVehicle extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.initElements();
	};

	initElements(){
		this.body = new MyVehicleBody(this.scene);
	}

	display(){
		this.body.display();
	};

	updateTextCoords(length_s, length_t){
	};

};
