/**
 * MyPlane
 * @constructor
 */
class MyPlane extends CGFobject
{
	constructor(scene, nPartsU, nPartsV)
	{
		super(scene);
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints=[];
		this.degree1 = 1;
		this.degree2 = 1;
		this.initControlPoints();
		this.makeSurface(this.degree1, this.degree2, this.controlPoints, this.nPartsU, this.nPartsV);
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

	makeSurface(degree1, degree2, controlvertexes, npartsU, npartsV) {
			
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		this.nurbObj = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display(){
		this.nurbObj.display();
	};

	updateTextCoords(length_s, length_t){

	};

};
