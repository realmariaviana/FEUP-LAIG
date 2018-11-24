/**
 * MyTerrain
 * @constructor
 */
class MyTerrain extends MyPlane
{
	constructor(scene, texture, heightmap, parts, heightscale)
	{
		super(scene, parts, parts);

		this.parts = parts;
		this.heightscale = heightscale;
		this.terrain = new CGFshader(this.scene.gl,"../shaders/terrain.vert","../shaders/terrain.frag");
		this.terrain.setUniformsValues({uSampler2:1});
		this.terrain.setUniformsValues({heightscale:heightscale});
		this.terraintxt = texture;
		this.heightmap = heightmap;
	};

	display(){
		this.scene.setActiveShader(this.terrain);
		this.terraintxt.bind(0);
		this.heightmap.bind(1);
		super.display();
		this.heightmap.unbind(1);
		this.terraintxt.unbind(0);
		this.scene.setActiveShader(this.scene.defaultShader);

	}
};
