/**
 * MyComponent
 * @constructor
 */
class MyComponent
{
    constructor(scene, id, transformationsMatrix, materials, textureInfo, children)
	{
        this.scene = scene;
        this.id = id;
        this.transformationsMatrix = transformationsMatrix;
        this.materials = materials;
        this.texture = textureInfo[0];
        this.length_s = textureInfo[1];
        this.length_t = textureInfo[2];
        this.childComponents = children[1];
        this.primitives = children[0];
        this.changing = 0;
        this.setDefaultMaterial();
        
    };

    display(){
        if(!this.changing){
        let currentMaterial = null, currentText = null;

        this.scene.pushMatrix();

        //transformations
        this.scene.multMatrix(this.transformationsMatrix);

        //materials
        if(this.material == null){
            currentMaterial= this.scene.materialsStack[this.scene.materialsStack.length-1];
        }else {
            currentMaterial = this.material;
        }

           

        this.scene.materialsStack.push(currentMaterial);

       // console.log(this.id,this.scene.texturesStack);
    

        //textures
        if(this.id=="cactus")console.log(this.texture);
        if(this.texture == null){
            currentText=this.scene.texturesStack[this.scene.texturesStack.length-1];
        }   
        else currentText = this.texture;

        this.scene.texturesStack.push(currentText);

        //apply settings
        currentMaterial.setTexture(currentText);
        currentMaterial.apply();


        //dispplay children
        for(let i = 0; i<this.primitives.length;i++){
            this.primitives[i].updateTextCoords(this.length_s,this.length_t);
            this.primitives[i].display();
        }

        for(let j = 0; j<this.childComponents.length;j++){
            this.childComponents[j].display();
        }
        
        //console.log(this.scene.materialsStack);
        this.scene.materialsStack.pop();
        this.scene.texturesStack.pop();
        this.scene.popMatrix();
    }
    }


    setDefaultMaterial(){
        this.material = this.materials[0];
        this.materialIndex = 0;    };

    changeMaterial(){

        this.changing = 1;
       
        if(this.materialIndex == this.materials.length-1) {
            this.materialIndex = 0;
            this.material = this.materials[0];
        }
        else {
            this.materialIndex++;
            this.material = this.materials[this.materialIndex];
        }

        this.changing = 0;
    }


};
