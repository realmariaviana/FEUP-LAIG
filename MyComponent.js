/**
 * MyComponent
 * @constructor
 */
class MyComponent
{
	constructor(scene, id, transformationsMatrix, material, textureInfo, children)
	{
        this.transformationsMatrix = transformationsMatrix;
        this.material = material;
        this.texture = textureInfo[0];
        this.length_s = textureInfo[1];
        this.length_t = textureInfo[2];
        this.childComponents = children[1];
        this.primitives = children[0];
    };

};
