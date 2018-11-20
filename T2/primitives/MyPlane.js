/**
 * MyPlane
 * @constructor
 */
class MyPlane extends CGFobject
{
	constructor(scene, id, nPartsU, nPartsV)
	{
		super(scene);
		this.id = id;
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints=[];
		this.degree1 = 1;
		this.degree2 = 1;
		this.initControlPoints();
		this.nurbObj = this.scene.makeSurface(this.degree1, this.degree2, this.controlPoints);
	};

	initControlPoints(){
		this.controlPoints = [	
			
			[ 
				 [ 0.5, 0.0, -0.5, 1 ],
				 [ 0.5, 0.0, 0.5, 1 ]							 
			],
			[ 
				[-0.5, 0.0, -0.5, 1 ],
				[-0.5,  0.0, 0.5, 1 ]
			   
		   ]
		];
		
	}

	makeSurface(){
		var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlPoints);
		this.nurbObj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	};

	display(){
		this.nurbObj.display();
	};

	updateTextCoords(length_s, length_t){

	};

};
