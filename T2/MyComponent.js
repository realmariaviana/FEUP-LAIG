/**
 * MyComponent
 * @constructor
 */
class MyComponent
{
    constructor(scene, id, transformationsMatrix, materials, textureInfo, children, animations)
	{
        this.scene = scene;
        this.id = id;
        this.transformationsMatrix = transformationsMatrix;
        this.materials = materials;
        this.texture = textureInfo[0];
        this.length_s = textureInfo[1];
        this.length_t = textureInfo[2];
        this.textureInfo = [this.texture,this.length_s,this.length_t];
        this.childComponents = children[1];
        this.primitives = children[0];
        this.changing = 0;
        this.animations = animations;
        this.setDefaultMaterial();
        
    };

    display(){
        if(!this.changing){
        let currentMaterial = null, currentTextInfo = this.textureInfo;
        this.scene.pushMatrix();

        //transformations
        this.scene.multMatrix(this.transformationsMatrix);

        //materials
        if(this.material == "inherit"){

            if(this.scene.materialsStack.length==0) {
                currentMaterial = this.scene.defaultMaterial;
            }else 
                currentMaterial= this.scene.materialsStack[this.scene.materialsStack.length-1];

        }
        else {
            currentMaterial = this.material;
        }

        this.scene.materialsStack.push(currentMaterial);
        //textures
        if(this.texture == "inherit"){
            if(this.length_s == null && this.length_t==null){
                currentTextInfo=this.scene.texturesStack[this.scene.texturesStack.length-1];
            }else {
                currentTextInfo[0] = this.scene.texturesStack[this.scene.texturesStack.length-1][0];
            }
        }else if(this.texture == "none") currentTextInfo[0] = null;
        else{
            if(this.length_s == null && this.length_t==null)
                this.scene.graph.onXMLMinorError("Lenght_s/length_t null, assuming 1")
            currentTextInfo = this.textureInfo;
        } 
        this.scene.texturesStack.push(currentTextInfo);
        

        //apply setting
        currentMaterial.setTexture(currentTextInfo[0]);
        currentMaterial.apply();


        for(let i = 0; i < this.animations.length; i++){
            this.animations[i].apply();
        }


        //display children
        for(let i = 0; i<this.primitives.length;i++){
            this.primitives[i].updateTextCoords(currentTextInfo[1],currentTextInfo[2]);
            this.primitives[i].display();
        }

        for(let j = 0; j<this.childComponents.length;j++){
            this.childComponents[j].display();
        }
        
        this.scene.materialsStack.pop();
        this.scene.texturesStack.pop();
        this.scene.popMatrix();
        }
    }

    update(timePassed){
        for(let i = 0; i < this.animations.length; i++){
            this.animations[i].update(timePassed);
        }

        for(let i = 0; i < this.childComponents.length; i++){
            //this.childComponents[i].update(timePassed);
        }

    }

    /**
      * Sets default material
      */
    setDefaultMaterial(){
        this.material = this.materials[0];
        this.materialIndex = 0;   
     };

     /**
      * Auxiliary function for keyM feature
      */
    changeMaterial(){

        this.changing = 1;
       
        if(this.materialIndex == this.materials.length-1) { //when it's the last texture in the array
            this.materialIndex = 0;
            this.material = this.materials[0];
        }
        else {
            this.materialIndex++; //next texture
            this.material = this.materials[this.materialIndex]; //sets new material
        }

        this.changing = 0;
    }


};
