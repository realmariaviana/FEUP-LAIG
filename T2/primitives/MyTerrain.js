/**
 * MyTerrain
 * @constructor
 */
class MyTerrain extends CGFobject
{
	constructor(scene, idtexture, idheightmap, parts, heightscale)
	{
		super(scene);

		this.idtexture = idtexture;
		this.idheightmap = idheightmap;
		this.parts = parts;
		this.heightscale = heightscale;

	};
};
