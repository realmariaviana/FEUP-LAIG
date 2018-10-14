/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyQuad extends CGFobject
{
	constructor(scene, x0, y0, x1, y1)
	{
		super(scene);
		this.x0 = x0;
		this.x1 = x1;

		this.y0 = y0;
		this.y1 = y1;

		this.initBuffers();

	this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			this.x0, this.y0, 0,
			this.x1, this.y0, 0,
			this.x1, this.y1, 0,
			this.x0, this.y1, 0,
		];

		this.indices = [
				0, 1, 2,
				2, 3, 0,
			];
			
		this.normals = [
				0,0,1,
				0,0,1,
				0,0,1,
				0,0,1,
			];

			this.texCoords = [
				0, 1, //this.minS, this.maxT,
				1, 1, //this.maxS, this.maxT,
				0, 0, //this.minS, this.minT,
				1, 0, //this.maxS, this.minT
			];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
