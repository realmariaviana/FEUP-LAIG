/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject
{
	constructor(scene,nPartsU,nPartsV, nPointsU, nPointsV, controlPoints)
	{
		super(scene);
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.degree1 = nPointsU-1;
		this.degree2 = nPointsV-1;
		this.controlPoints = [];
		this.initControlPoints(controlPoints,nPointsU,nPointsV);
		this.makeSurface(this.degree1, this.degree2, this.controlPoints, this.nPartsU, this.nPartsV);

	};

	initControlPoints(controlPoints,nPointsU,nPointsV){
		for(let i = 0; i<controlPoints.length;i++){
		controlPoints[i].push(1);
		}

		let i = 0;

		for(let k = 1; k<=nPointsU;k++){

			let pointsU = [];

			for(let j=1; j<=nPointsV;j++){
				pointsU.push(controlPoints[i]);
				i++;
			}
			this.controlPoints.push(pointsU);
		}
	
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
