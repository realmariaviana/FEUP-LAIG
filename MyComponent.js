/**
 * MyComponent
 * @constructor
 */
class MyComponent
{
    constructor(scene, id, transformationsMatrix, material, textureInfo, children)
	{
        this.scene = scene;
        this.id = id;
        this.transformationsMatrix = transformationsMatrix;
        this.material = material;
        this.texture = textureInfo[0];
        this.length_s = textureInfo[1];
        this.length_t = textureInfo[2];
        this.childComponents = children[1];
        this.primitives = children[0];
    };

    display(){
        this.scene.pushMatrix();
        //console.log(this.transformationsMatrix);
        this.scene.multMatrix(this.transformationsMatrix);
        for(let i = 0; i<this.primitives.length;i++){
            this.primitives[i].display();
        }

        for(let j = 0; j<this.childComponents.length;j++){
            this.childComponents[j].display();
        }

        this.scene.popMatrix();
    }

};
