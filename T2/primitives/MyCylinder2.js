/**
 * MyCylinder2
 * @constructor
 */
class MyCylinder2 extends CGFobject
{
	/**
	 * MyPatch class constructor
	 * @param scene Scene
	 * @param base
	 * @param top
	 * @param height
	 * @param slices
	 * @param stacks
	 */
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);

		this.base = base;
		this.npartsU = slices/2;
		this.npartsV = stacks/2;
		this.top = top;
		this.height = height;
		this.degree1 = 3;
		this.degree2 = 1;
		this.initControlPoints();
		this.makeSurface(this.degree1, this.degree2, this.controlPoints, this.npartsU, this.npartsV);
	};

	/**
	*Initializes control points
	*/
	initControlPoints(){
		this.controlPoints=[
			[
				[-this.top,0.0,this.height,1],
				[-this.base,0.0,0.0,1]
			],
			[
				[-this.top,(4/3)*this.top,this.height,1],
				[-this.base,(4/3)*this.base,0.0,1]
			],
			[
				[this.top,(4/3)*this.top,this.height,1],
				[this.base,(4/3)*this.base,0.0,1]
			],
			[
				[this.top,0.0,this.height,1],
				[this.base,0.0,0.0,1]
			]
		];

	}

	/**
	* Creates surfaces 
	* @param degree1
	* @param degree2
	* @param controlvertexes Control Points
	* @param npartsU Parts in the u direction
	* @param npartsV Parts in the v direction
	*/
	makeSurface(degree1, degree2, controlvertexes, npartsU, npartsV) {
			
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		this.nurbObj = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	/**
     * Displays surface.
     */
	display(){
		this.nurbObj.display();
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI,0,0,1);
		this.nurbObj.display();
		this.scene.popMatrix();
	};

	updateTextCoords(length_s, length_t){

	};

	
};
