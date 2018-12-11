/**
 * MyWater
 * @constructor
 */
class MyWater extends MyPlane
{	
	/**
	 * MyWater class constructor
	 * @param scene Scene
	 * @param texture 
	 * @param wavemap
	 * @param parts
	 * @param heightscale 
	 * @param texscale 
	 */
	constructor(scene, texture, wavemap, parts, heightscale, texscale)
	{
		super(scene, parts, parts);

		this.texture = texture;
		this.wavemap = wavemap;
		this.parts = parts;
		this.heightscale = heightscale;
		this.texscale = texscale;
		this.time = 0;

		this.water = new CGFshader(this.scene.gl,"../font/shaders/water.vert","../font/shaders/water.frag");
		this.water.setUniformsValues({uSampler2:1});
		this.water.setUniformsValues({heightscale: heightscale});
		this.water.setUniformsValues({texscale: texscale});
		this.water.setUniformsValues({time:this.time});
	};

	/**
     * @param deltaTime Time delta since the last update.
     */
	update(deltaTime){
		this.time+=deltaTime;
		this.water.setUniformsValues({time:this.time});
	}

	/**
     * Displays water.
     */
	display(){
		this.scene.setActiveShader(this.water);
		this.texture.bind(0);
		this.wavemap.bind(1);
		super.display();
		this.wavemap.unbind(1);
		this.texture.unbind(0);
		this.scene.setActiveShader(this.scene.defaultShader);

	}
};
