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
        let removeText = 0, removeMat = 0;
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformationsMatrix);

        if(this.id == "cactus") console.log(this.scene.componentsStack[this.scene.componentsStack.length-1].id);

        if(this.texture == null){
         this.texture = this.scene.componentsStack[this.scene.componentsStack.length-1].texture;
         removeText = 1;
        }

        if(this.material == null){
            this.material = this.scene.componentsStack[this.scene.componentsStack.length-1].material;
            removeMat = 1;
           }
        
        this.material.setTexture(this.texture);
        this.material.apply();


        this.scene.componentsStack.push(this);


        for(let i = 0; i<this.primitives.length;i++){
            this.primitives[i].updateTextCoords(this.length_s,this.length_t);
            this.primitives[i].display();

        }


        for(let j = 0; j<this.childComponents.length;j++){
            this.childComponents[j].display();
        }
        

        this.scene.componentsStack.pop();

        if(removeText)  this.texture  = null;
        if(removeMat) this.material  = null;
        this.scene.popMatrix();
    }

};
