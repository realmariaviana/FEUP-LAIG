/**
 * MyWater
 * @constructor
 */
class MyWater extends MyPlane
{
	constructor(scene, texture, wavemap, parts, heightscale, texscale)
	{
		super(scene, parts, parts);

		this.texture = texture;
		this.wavemap = wavemap;
		this.parts = parts;
		this.heightscale = heightscale;
		this.texscale = texscale;
		this.time = 0;

		this.water = new CGFshader(this.scene.gl,"../shaders/water.vert","../shaders/water.frag");
		this.water.setUniformsValues({uSampler2:1});
		this.water.setUniformsValues({heightscale: 0.2});
		this.water.setUniformsValues({time:this.time});
	};

	update(deltaTime){
		this.time+=deltaTime;
		this.water.setUniformsValues({time:this.time});
	}

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
