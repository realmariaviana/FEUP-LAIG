/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject
{
	constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints)
	{
		super(scene);

		this.nPointsU = nPointsU;
		this.nPointsV = nPointsV;
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints = controlPoints;
	};

	
};
