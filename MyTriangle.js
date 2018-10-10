/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, x0, y0, z0, x1, y1, z1, x2, y2, z2)
	{
		console.log("done");

		super(scene);

		this.p1 = [x0, y0, z0];
		this.p2 = [x1, y1, z1];
		this.p3 = [x2, y2, z2];
		this.initBuffers();
	};

	initBuffers()
	{
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		this.vertices = [
				p1[0],p1[1], p1[2],
				p2[0],p2[1], p2[2],
				p3[0],p3[1], p3[2]
				];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]

		this.indices = [
			0, 1, 2
		];


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
