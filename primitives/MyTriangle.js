/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
	{

		super(scene);

		 this.v1 = vec3.fromValues(x1, y1, z1);
		 this.v2 = vec3.fromValues(x2, y2, z2);
		 this.v3 = vec3.fromValues(x3, y3, z3);
	 
		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			this.v1[0], this.v1[1], this.v1[2],
			this.v2[0], this.v2[1], this.v2[2],
			this.v3[0], this.v3[1], this.v3[2],
	
		];
	
		this.indices = [
			0, 1, 2
		];
	
		var V21 = vec3.create();  //vetor do ponto 1 ao ponto 2
		var V21 =[this.v2[0]-this.v1[0],
				  this.v2[1]-this.v1[1],
				  this.v2[2]-this.v1[2]];
	
		var V32 = vec3.create(); //vetor do ponto 2 ao ponto 3
		var V32 =[this.v3[0]-this.v2[0],
				  this.v3[1]-this.v2[1],
				  this.v3[2]-this.v3[2]];
	
		var N =vec3.create() //n - normal ao triangulo
		vec3.cross(N, V21, V32);
		  vec3.normalize(N, N);
	
		  this.normals = [
			  N[0], N[1], N[2],
			  N[0], N[1], N[2],
			  N[0], N[1], N[2],];
	
		this.texCoords = [
			0, 1, //this.minS, this.maxT,
			1, 1, //this.maxS, this.maxT,
			0, 0, //this.minS, this.minT,
			1, 0 //this.maxS, this.minT
		];
	
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
