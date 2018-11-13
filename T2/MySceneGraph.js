var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var scene_index = 0;
var views_index = 1;
var ambient_index = 2;
var lights_index = 3;
var textures_index = 4;
var materials_index = 5;
var transformations_index = 6;
var animations_index = 7;
var primitives_index = 8;
var components_index = 9;


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.
        this.rootNode = null;
        this.defaultViewId = null;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.views = [];
        this.materials = [];
        this.textures = [];
        this.lights=[];
        this.primitives=[];
        this.animations=[];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

       nodeNames = this.getChildrensNames(nodes);

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != scene_index)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != views_index)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != ambient_index)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

         // <lights> 
         if ((index = nodeNames.indexOf("lights")) == -1) 
            return "tag <lights> missing"; 
        else { 
            if (index != lights_index) 
                this.onXMLMinorError("tag <lights> out of order"); 

                //Parse ambient block
                if ((error = this.parseLights(nodes[index])) != null)
                return error;

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != textures_index)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse ambient block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        } 
        
        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != materials_index)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse ambient block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        } 

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != animations_index)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse ambient block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        } 

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != primitives_index)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        } 

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
        if (index != transformations_index)
            this.onXMLMinorError("tag <transformations> out of order");
         //Parse ambient block
        if ((error = this.parseTransformations(nodes[index])) != null)
            return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
        if (index != components_index)
            this.onXMLMinorError("tag <components> out of order");
         //Parse ambient block
        if ((error = this.parseComponents(nodes[index])) != null)
            return error;
        }
        
     }

    }

    /**
     * Checks if attribute is valid: not null, number and inbetween limits 
     * @param {*} attribute 
     * @param {*} canBeNull 
     * @param {*} isNumber 
     * @param {*} limit1 
     * @param {*} limit2 
     */
    isAttrValid(attribute, canBeNull, isNumber, isInteger, limit1, limit2,){
        if((!canBeNull && attribute==null) 
            || (isNumber && isNaN(attribute))
            || (limit1!=null && attribute < limit1)
            || (limit2!=null && attribute > limit2)
            || (isInteger && !(parseInt(attribute)==attribute)))
            
            return null;
        else return 1;    
    }

    /**
     * Parses RGB components and returns array
     * @param {*} node 
     */
    parseRGBA(node, tagName, id){

        var arr=[0,0,0];
        var temp;

        // R
        temp = this.reader.getFloat(node, 'r');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)){
            this.onXMLMinorError("Invalid attribute r in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[0] =1;
        }
        else arr[0] = temp;

        // G
        temp = this.reader.getFloat(node, 'g');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)){
            this.onXMLMinorError("Invalid attribute g in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[1] =1;
        }
        else arr[1] = temp;

        // B
        temp = this.reader.getFloat(node, 'b');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)){
            this.onXMLMinorError("Invalid attribute b in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[2] =1;
        }
        else arr[2] = temp;

        // B
        temp = this.reader.getFloat(node, 'a');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)){
            this.onXMLMinorError("Invalid attribute a in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[3] =1;
        }
        else arr[3] = temp;

        return arr;        
    }

    /**
    * Parses x,y,z coordinates into an array
    * @param {*} node 
    */
    parseXYZ(node, tagName, id){

        var arr=[0,0,0];
        var temp;

        // X
        temp = this.reader.getFloat(node, 'x',false);
        if(temp == null)  temp = this.reader.getFloat(node, 'xx',false);
        if(!this.isAttrValid(temp,0,1,0,null,null)){
            this.onXMLMinorError("Invalid attribute x in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[0] =1;
        } 
        else arr[0] = temp;

        // Y
        temp = this.reader.getFloat(node, 'y',false);
        if(temp == null)  temp = this.reader.getFloat(node, 'yy',false);
        if(!this.isAttrValid(temp,0,1,0,null,null)){
            this.onXMLMinorError("Invalid attribute y in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[1] =1;
        }
        else arr[1] = temp;

        // Z
        temp= this.reader.getFloat(node, 'z',false);
        if(temp == null)  temp = this.reader.getFloat(node, 'xzzx',false);

        if(!this.isAttrValid(temp,0,1,0,null,null)){
            this.onXMLMinorError("Invalid attribute z in " + tagName + " ID: " + id + ". Assuming 1.");
            arr[2] =1;
        }
        else arr[2] = temp;

        return arr;        
    }

    /**
     * Parses the <SCENE> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

            this.idRoot = this.reader.getString(sceneNode, 'root');
            if (this.idRoot == null)
                return "no root defined for scene";

            this.axis_length = this.reader.getString(sceneNode, 'axis_length');
            if (this.axis_length == null || isNaN(this.axis_length))
                return "no axis_length defined for scene";

        this.log("Parsed scene");

        return null;
    }

     /**
     * Parses the <VIEW> block.
     * @param {view block element} sceneNode
     */
    parseViews(viewsNode){
        this.defaultView = this.reader.getString(viewsNode, 'default');
        var id;
        var ids= [];

        if (this.defaultView == null)
                return "no default view defined for scene";

        var children = viewsNode.children;      
        var nodeNames= []; 

        
        nodeNames = this.getChildrensNames(children);
        
        for(var i=0; i<nodeNames.length;i++){
            id = this.reader.getString(children[i], 'id');

            //check is is unique
            if (this.existsID( ids, this.reader.getString(children[i], "id"))) 
                return "ID must be unique for each view (conflict: ID = " + id + ")";
            else{

                if(nodeNames[i] == "perspective") {this.parsePerspectiveView(children[i]); ids.push(id);}
                else if(nodeNames[i] == "ortho") {this.parseOrthoView(children[i]); ids.push(id);}
                else return "View tag is undefined";
            }
        }

        return null;

    }

    /**
     * Parses a ortho view
     * @param {*} orthoNode 
     */
    parseOrthoView(orthoNode){

        var viewId = this.reader.getString(orthoNode, 'id');
        var near = this.reader.getFloat(orthoNode, 'near');
        var far = this.reader.getFloat(orthoNode, 'far');
        var left = this.reader.getFloat(orthoNode, 'left');
        var right = this.reader.getFloat(orthoNode, 'right');
        var top = this.reader.getFloat(orthoNode, 'top');
        var bottom = this.reader.getFloat(orthoNode, 'bottom');

        //orthos's children
        
        var toNode = this.getChildNode(orthoNode,"to");
        var fromNode = this.getChildNode(orthoNode,"from");

        var toCoords = [0, 0, 0];
        var fromCoords = [0, 0, 0];

        //from

        if (fromNode) {
            fromCoords = this.parseXYZ(fromNode,"From coordinates in Ortho View",viewId);
        }

        //to
        if (toNode) {
            toCoords = this.parseXYZ(toNode,"To coordinates in Ortho View",viewId);
            
        }

        this.views[viewId] = [near, far, left, right, top, bottom, toCoords,fromCoords];
        this.views[viewId].type = "ortho";

        this.log("Parsed ortho view")
    }

    /**
     * Parses a perspective view 
     * @param {*} perspectiveNode 
     */
    parsePerspectiveView(perspectiveNode){

        var idView = this.reader.getString(perspectiveNode, 'id');
        var near = this.reader.getFloat(perspectiveNode, 'near');
        var far = this.reader.getFloat(perspectiveNode, 'far');
        var angle = this.reader.getFloat(perspectiveNode, 'angle');

        //perspective's children
        
        var toNode = this.getChildNode(perspectiveNode,"to");
        var fromNode = this.getChildNode(perspectiveNode,"from");

        var toCoords = [0, 0, 0];
        var fromCoords = [0, 0, 0];

        //from

        if (fromNode) 
            fromCoords = this.parseXYZ(fromNode,"From coordinates in Perspective View",idView);

        //to
        if (toNode) 
            toCoords = this.parseXYZ(toNode,"To coordinates in Perspective View",idView);

        this.views[idView]=[near,far,angle,toCoords,fromCoords];
        this.views[idView].type = "perspective";
        
        this.log("Parsed Perspective view");
    }

    /**
     * Returns a node's child with the tag name tagName
     * @param {*} node 
     * @param {*} tagName 
     */
    getChildNode(node, tagName){
        var children = node.children;
        var nodeNames= [];

        nodeNames = this.getChildrensNames(children);

        if(nodeNames.indexOf(tagName) != -1) return children[nodeNames.indexOf(tagName)];
        else return null;

    }

    /**
     * Parses the <AMBIENT> node.
     * @param {ambient block element} ambientNode
     */
   parseAmbient(ambientNode){

      var ambientN = this.getChildNode(ambientNode, "ambient");
      var backgroundN = this.getChildNode(ambientNode, "background");

      this.ambient = [];
      this.background = [];

      //ambient
      if (ambientN)
        this.ambient = this.parseRGBA(ambientN,"ambient","this tag has no id");

      //background
        if (backgroundN)
            this.background = this.parseRGBA(backgroundN,"background","this tag has no id");

      this.log("Parsed ambient");

      return null;
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
 
        var children = lightsNode.children;
        var ids = [];
        this.lights = [];
        var locationLight = [], ambientLight = [], diffuseLight = [], specularLight= [], targetLight = [];
        var angle, exponent;
        
 
        // Any number of omnis.
        for (var i = 0; i < children.length; i++) {  
            
            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";
    
            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";
            
    
            // Light enable/disable
            var enableLight = true;
            var aux_light = this.reader.getBoolean(children[i], 'enabled');
            if(aux_light==null)
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            else
            {
                if (!(aux_light != null && !isNaN(aux_light) && (aux_light == 0 || aux_light == 1)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            else
                enableLight = aux_light == 0 ? false : true;
            }

            //common elements
            // Gets indices of each element.
            var locationNode = this.getChildNode(children[i],"location");
            var ambientNode = this.getChildNode(children[i],"ambient");
            var diffuseNode = this.getChildNode(children[i],"diffuse");
            var specularNode = this.getChildNode(children[i],"specular");
    
            // Retrieves the light position.
            if (locationNode) {

                locationLight = this.parseXYZ(locationNode,"location in light",lightId);

                 // w
                var w = this.reader.getFloat(locationNode, 'w');
                if (w == null || isNaN(w) || w < 0 || w > 1){
                    w = 1;
                    this.onXMLMinorError("Invalid attribute w in location in light ID: view1-perspective: assuming 1.");
                }else locationLight.push(w);    
            }
            else
                return "light location undefined for ID = " + lightId;
    
            // Retrieves the ambient component.
            if (ambientNode) 
                ambientLight = this.parseRGBA(ambientNode,"ambient in light",lightId);
            else
                return "ambient component undefined for ID = " + lightId;
    
            //Retrieve the diffuse component
            if (diffuseNode) 
                diffuseLight = this.parseRGBA(diffuseNode,"diffuse in light",lightId);
            else
                return "diffuse component undefined for ID = " + lightId;
    
            // Retrieve the specular component
            if (specularNode) 
                specularLight = this.parseRGBA(specularNode,"specular in light",lightId);
            else
                return "specular component undefined for ID = " + lightId;


            //specific elements
            if (children[i].nodeName == "spot") {
                angle = this.parseSpot(children[i])[0];
                exponent = this.parseSpot(children[i])[1];
                targetLight = this.parseSpot(children[i],lightId)[2];
                this.lights[lightId] = [enableLight, locationLight, ambientLight, diffuseLight, specularLight, angle, exponent, targetLight];
            }else if (children[i].nodeName == "omni"){
                this.lights[lightId] = [enableLight, locationLight, ambientLight, diffuseLight, specularLight];
            }else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }    
        }

    }
 
    /**
     * Parses a spot light
     * @param {*} spotNode 
     */
    parseSpot(spotNode,id) {

        var angle = this.reader.getFloat(spotNode, 'angle');
        if(angle == null){
            this.onXMLMinorError("angle value missing for ID = " + lightId);
            angle = 0;
        }

        
        var exponent = this.reader.getFloat(spotNode, 'exponent');
        if(exponent == null){
            this.onXMLMinorError("exponent value missing for ID = " + lightId);
            exponent = 0;
        }

        // Gets indices of each element.
        var targetNode = this.getChildNode(spotNode,"target");
        var target = [];

        // Retrieves the light position.
        if (targetNode) 
            target = this.parseXYZ(targetNode,"target in spot light",id);
        else
            return "light location undefined for ID = " + lightId;   

        return [angle,exponent,target];
    }
    
    /**
     * Parses the <TEXTURES> node.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var ids = [];
        var children = texturesNode.children;
        var oneTextureDefined = false;

        var nodeNames = this.getChildrensNames(children);

        // Any number of texture.
        for (var i = 0; i < nodeNames.length; i++) {

            if (nodeNames[i] != "texture") {
                this.onXMLMinorError("unknown tag <" + nodeNames[i] + ">");
                continue;
            }

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.existsID(ids, textureId))
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            // Texture file
            var textureFile = this.reader.getString(children[i], 'file');
            if(textureFile==null)
                this.onXMLMinorError("filepath missing for ID = " + textureId);
            else{
            var texture = new CGFtexture(this.scene, textureFile);
            this.textures.push([textureId, texture]);   
            ids.push(textureId);
            oneTextureDefined = true;
            }
        }

        if (!oneTextureDefined)
            return "at least one texture must be defined in the TEXTURES block";

     this.log("Parsed textures");
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode 
     */
    parseMaterials(materialsNode){
        var children = materialsNode.children;      
        var nodeNames= [], ids = [], matId;

        nodeNames= this.getChildrensNames(children);

        for(var i=0; i<nodeNames.length;i++){
            if(nodeNames[i] == "material"){
                matId = this.reader.getString(children[i], 'id');

                if (this.existsID(ids, matId)) return "ID must be unique for each material (conflict: ID = " + matId + ")";
                else {this.parseMaterial(children[i], matId, this.reader.getFloat(children[i],"shininess"));
                    ids.push(matId);
                }
            } 
            else this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        }

        this.log("Parsed Materials");
    }

    /**
     * Parses a single Material
     * @param {*} materialNode 
     * @param {*} id 
     * @param {*} shininess 
     */
    parseMaterial(materialNode, id, shininess){
        
        let emission=[],  ambient=[], diffuse=[],specular=[];
        let emissionN = this.getChildNode(materialNode, "emission");
        let ambientN = this.getChildNode(materialNode, "ambient");
        let diffuseN = this.getChildNode(materialNode, "diffuse");
        let specularN = this.getChildNode(materialNode, "specular");
        let temp = new CGFappearance(this.scene);


        temp.setShininess(shininess);

        //RBG emission

        emission = this.parseRGBA(emissionN,"emission in material",id);
        temp.setEmission(emission[0],emission[1], emission[2],emission[3]);

        //RBG ambientN
        ambient = this.parseRGBA(ambientN,"ambient in material",id);
        temp.setAmbient(ambient[0],ambient[1], ambient[2],ambient[3]);

        //RBG diffuseN
        diffuse = this.parseRGBA(diffuseN,"diffuse in material",id);
        temp.setDiffuse(diffuse[0],diffuse[1], diffuse[2],diffuse[3]);

        //RBG specularN
        specular = this.parseRGBA(specularN,"specular in material",id);
        temp.setSpecular(specular[0],specular[1], specular[2],specular[3]);
        this.materials.push([id,temp]);
        
    }

    //FALTA CONTROLPOINT
    /**
     * Parses the <ANIMATIONS> node.
     * @param {animations block element} animationsNode 
     */
     parseAnimations(animationsNode){
         var children = animationsNode.children;
         var nodeNames = this.getChildrensNames(children);
        var ids = [];
        var grandChildren=[];

         for (var i = 0; i < nodeNames.length; i++) {  

            var aniID = this.reader.getString(children[i], 'id');
            if (aniID == null)
                return "no ID defined for animation";
   
            if (this.existsID(ids, aniID)) return "ID must be unique for each animation (conflict: ID = " + aniID + ")";
           
            var span = this.reader.getFloat(children[i], 'span');
            if(span == null){
                this.onXMLMinorError("span value missing for ID = " + aniID);
            }
            
            if(nodeNames[i] == "circular")
                this.parseCirularAnimation(children[i], aniID, span);

            else if(nodeNames[i] == "linear"){
    
                this.parseLinearAnimation(children[i],id,span);

             }  
            
             else this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
         }


        console.log("Parsed Animations");
     }

    parseLinearAnimation(node, id, span){
        let children = node.children;
        let coords = [];
        
        if(children.length<2) 
            this.onXMLError("Animation id=" + id + " must have at least 2 control points");
        
        for(let i = 0; i < children.length;i++){
           
            coords.push( this.parseXYZ(children[i],"linear animation",id));
        }

        this.animations.push([id,new LinearAnimation(this.scene,id,span,coords)]);
     }


    parseCirularAnimation(node,id,span){

        var center = this.reader.getVector3(node, 'center');
        if(center == null){
            this.onXMLMinorError("center value missing for ID = " + aniID);
        }

        var radius = this.reader.getFloat(node, 'radius');
        if(radius == null){
            this.onXMLMinorError("radius value missing for ID = " + aniID);
        }

        var startang = this.reader.getFloat(node, 'startang');
        if(startang == null){
            this.onXMLMinorError("startang value missing for ID = " + aniID);
        }

        var rotang = this.reader.getFloat(node, 'rotang');
        if(rotang == null){
            this.onXMLMinorError("rotang value missing for ID = " + aniID);
        }

        this.animations.push([id,new CircularAnimation(this.scene,id,span,center,radius,startang,rotang)]);
     }

    /**
     * Parses the <PRIMITIVES> node.
     * @param {primitives block element} primitivesNode 
     */
    parsePrimitives(primitivesNode){
        var primitives = primitivesNode.children;    
        var nodeNames= []; 
        var ids = [];
        var pID;

        nodeNames= this.getChildrensNames(primitives);

        for(var i=0; i<nodeNames.length;i++){
            if(nodeNames[i] == "primitive"){
                pID = this.reader.getString(primitives[i], 'id');

                //check repeated ids
                if (this.existsID(ids, pID)) return "ID must be unique for each material (conflict: ID = " + pID + ")";
                    ids.push(pID);
                
                //check more than one tag inbetween primitive tags
                var primitive = primitives[i].children;
                if(primitive.length>1) return "Primitives can't have more than one tag (conflict ID = " + pID + ")";

                var control = this.primitiveHandler(primitive[0],pID);
                if(control!=null) return control;


            } 
            else this.onXMLMinorError("unknown tag <" + primitives[i].nodeName + ">");
        }
        this.log("Parsed Primitives");
    }

    /**
     * Handles every primitive
     * @param {*} node
     * @param {*} id
     */
    primitiveHandler(node, id){
        switch(node.nodeName){
            case "rectangle":
            return this.parseRectangle(node,id);

            case 'triangle':
            return this.parseTriangle(node,id);

            case 'sphere':
            return this.parseSphere(node, id);

            case 'cylinder':
            return this.parseCylinder(node, id);

            case 'torus':
            return this.parseTorus(node, id);

            case 'plane':
            return this.parsePlane(node, id);

            case 'patch':
            return this.parsePatch(node, id);

            case 'vehicle':
            return this.parseVehicle(node, id);

            case 'cylinder2':
            return this.parseCylinder2(node, id);

            case 'terrain':
            return this.parseTerrain(node, id);

            case 'water':
            return this.parseWater(node, id);

        }
    }

    /**
     * Parses Rectangle
     * @param {*} node
     * @param {*} id
     */
    parseRectangle(node, id){
        var x1 = this.reader.getFloat(node, "x1");
        if(!this.isAttrValid(x1,null,1)) return "Attribute x1 in primitive ID = " + id + " invalid";
        
        var x2 = this.reader.getFloat(node, "x2");
        if(!this.isAttrValid(x2,null,1)) return "Attribute x2 in primitive ID = " + id + " invalid";

        var y1 = this.reader.getFloat(node, "y1");
        if(!this.isAttrValid(y1,null, 1)) return "Attribute y1 in primitive ID = " + id + " invalid";

        var y2 = this.reader.getFloat(node, "y2");
        if(!this.isAttrValid(y2,null, 1)) return "Attribute y2 in primitive ID = " + id + " invalid";

        this.primitives.push([id,new MyQuad(this.scene,x1,y1,x2,y2)]);

        return null;
    }

     /**
     * Parses Triangle
     * @param {*} node
     * @param {*} id
     */
    parseTriangle(node, id){

        var x1 = this.reader.getFloat(node, "x1");
        if(!this.isAttrValid(x1,null,1)) return "Attribute x1 in primitive ID = " + id + " invalid";
        
        var x2 = this.reader.getFloat(node, "x2");
        if(!this.isAttrValid(x2,null,1)) return "Attribute x2 in primitive ID = " + id + " invalid";

        var x3 = this.reader.getFloat(node, "x3");
        if(!this.isAttrValid(x3,null,1)) return "Attribute x3 in primitive ID = " + id + " invalid";

        var y1 = this.reader.getFloat(node, "y1");
        if(!this.isAttrValid(y1,null, 1)) return "Attribute y1 in primitive ID = " + id + " invalid";

        var y2 = this.reader.getFloat(node, "y2");
        if(!this.isAttrValid(y2,null, 1)) return "Attribute y2 in primitive ID = " + id + " invalid";

        var y3 = this.reader.getFloat(node, "y3");
        if(!this.isAttrValid(y3,null, 1)) return "Attribute y3 in primitive ID = " + id + " invalid";

        var z1 = this.reader.getFloat(node, "z1");
        if(!this.isAttrValid(z1,null, 1)) return "Attribute z1 in primitive ID = " + id + " invalid";

        var z2 = this.reader.getFloat(node, "z2");
        if(!this.isAttrValid(z2,null,1)) return "Attribute z2 in primitive ID = " + id + "invalid";

        var z3 = this.reader.getFloat(node, "z3");
        if(!this.isAttrValid(z3,null,1)) return "Attribute z3 in primitive ID = " + id + "invalid";


        this.primitives.push([id,new MyTriangle( this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3)]);

        return null;
    }

     /**
     * Parses Cylinder
     * @param {*} node
     * @param {*} id
     */
    parseCylinder(node, id){
        var base = this.reader.getFloat(node, 'base');
        if(!this.isAttrValid(base,0,1)) return "Attribute base in primitive ID = " + id + " invalid";

        var top = this.reader.getFloat(node, 'top');
        if(!this.isAttrValid(top,0, 1)) return "Attribute top in primitive ID = " + id + " invalid";

        var height = this.reader.getFloat(node, 'height');
        if(!this.isAttrValid(height,null, 1)) return "Attribute height in primitive ID = " + id + " invalid";

        var stacks = this.reader.getFloat(node, 'stacks');
        if(!this.isAttrValid(stacks,null,1,1)) return "Attribute stacks in primitive ID = " + id + " invalid";

        var slices = this.reader.getFloat(node, 'slices');
        if(!this.isAttrValid(slices,null, 1,1)) return "Attribute slices in primitive ID = " + id + " invalid";

        this.primitives.push([id,new MyCylinder(this.scene, base, top, height, slices, stacks)]);
        return null;


    }

     /**
     * Parses Sphere
     * @param {*} node
     * @param {*} id
     */
    parseSphere(node, id){
        var radius = this.reader.getFloat(node, 'radius');
        if(!this.isAttrValid(radius,null, 1)) return "Attribute radius in primitive ID = " + id + " invalid";

        var slices = this.reader.getFloat(node, 'slices');
        if(!this.isAttrValid(slices,null, 1,1)) return "Attribute slices in primitive ID = " + id + " invalid";

        var stacks = this.reader.getFloat(node, 'stacks');
        if(!this.isAttrValid(stacks,null, 1,1)) return "Attribute stacks in primitive ID = " + id + " invalid";

        this.primitives.push([id,new MySphere(this.scene,radius,slices,stacks)]);
        return null;

    }

     /**
     * Parses Torus
     * @param {*} node
     * @param {*} id
     */
    parseTorus(node, id){
        var inner = this.reader.getFloat(node, 'inner');
        if(!this.isAttrValid(inner,null,1)) return "Attribute inner in primitive ID = " + id + " invalid";

        var outer = this.reader.getFloat(node, 'outer');
        if(!this.isAttrValid(outer,null, 1)) return "Attribute outer in primitive ID = " + id + " invalid";

        var slices = this.reader.getFloat(node, 'slices');
        if(!this.isAttrValid(slices,null, 1,1)) return "Attribute slices in primitive ID = " + id + " invalid";

        var loops = this.reader.getFloat(node, 'loops');
        if(!this.isAttrValid(loops,null, 1,1)) return "Attribute loops in primitive ID = " + id + " invalid";

        this.primitives.push([id,new MyTorus(this.scene,inner, outer, slices, loops)]);
        return null;

    }

    /**
     * Parses Plane
     * @param {*} node
     * @param {*} id
     */
    parsePlane(node, id){
        var nPartsU = this.reader.getInteger(node, 'npartsU');
        if(!this.isAttrValid(nPartsU,null, 1,1)) return "Attribute npartsU in primitive ID = " + id + " invalid";

        var nPartsV = this.reader.getInteger(node, 'npartsV');
        if(!this.isAttrValid(nPartsV,null, 1,1)) return "Attribute npartsV in primitive ID = " + id + " invalid";

        this.primitives.push([id, new MyPlane(this.scene, nPartsU, nPartsV)]);
        return null;
    }

    //NOT COMPLETE
    /**
     * Parses Patch
     * @param {*} node
     * @param {*} id
     */
    parsePatch(node, id){
        var nPointsU = this.reader.getInteger(node, 'npointsU');
        if(!this.isAttrValid(nPointsU,null,1,1)) return "Attribute nPointsU in primitive ID = " + id + " invalid";

        var nPointsV = this.reader.getInteger(node, 'npointsV');
        if(!this.isAttrValid(nPointsV,null, 1,1)) return "Attribute nPointsV in primitive ID = " + id + " invalid";

        var nPartsU = this.reader.getInteger(node, 'npartsU');
        if(!this.isAttrValid(nPartsU,null, 1,1)) return "Attribute nPartsU in primitive ID = " + id + " invalid";

        var nPartsV= this.reader.getInteger(node, 'npartsV');
        if(!this.isAttrValid(nPartsV,null, 1,1)) return "Attribute nPartsV in primitive ID = " + id + " invalid";

        let numCP = nPartsU * nPartsV;
        let controlNodes = node.children;
        let controlPoints = [];

        for(let i = 0; i < numCP; i++){
            controlPoints.push(this.parseXYZ(controlNodes[i],"Control Point"));
        }

        this.primitives.push([id, new MyPlane(this.scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints)]);
        return null;
    }

    /**
     * Parses Vehicle
     * @param {*} node
     * @param {*} id
     */
    parseVehicle(node, id){
        this.primitives.push([id, new MyVehicle(this.scene)]);
        return null;
    }

    /**
     * Parses Cylinder2
     * @param {*} node
     * @param {*} id
     */
    parseCylinder2(node, id){
        var base = this.reader.getFloat(node, 'base');
        if(!this.isAttrValid(base,null, 1,1)) return "Attribute base in primitive ID = " + id + " invalid";

        var top = this.reader.getFloat(node, 'top');
        if(!this.isAttrValid(top,null, 1,1)) return "Attribute top in primitive ID = " + id + " invalid";

        var height = this.reader.getFloat(node, 'height');
        if(!this.isAttrValid(height,null, 1,1)) return "Attribute height in primitive ID = " + id + " invalid";

        var slices = this.reader.getInteger(node, 'slices');
        if(!this.isAttrValid(slices,null, 1,1)) return "Attribute slices in primitive ID = " + id + " invalid";

        var stacks = this.reader.getInteger(node, 'stacks');
        if(!this.isAttrValid(stacks,null, 1,1)) return "Attribute stacks in primitive ID = " + id + " invalid";

        this.primitives.push([id, new MyCylinder2(this.scene, base, top, height, slices, stacks)]);
        return null; 
    }

    /**
     * Parses Terrain
     * @param {*} node
     * @param {*} id
     */
    parseTerrain(node, id){
        let temp = 0;
        var idtexture = this.reader.getString(node, 'idtexture');
        
        for(let i = 0; i< this.textures.length;i++){
            if(this.textures[i][0]==idtexture){
                 temp = 1;
                 break;
            }     
        }

        if(!temp)  return "Attribute idtexture in primitive ID = " + id + " invalid";

        var idheightmap = this.reader.getFloat(node, 'idheightmap');
        if(!this.isAttrValid(idheightmap,null, 1,1)) return "Attribute idheightmap in primitive ID = " + id + " invalid";

        var parts = this.reader.getFloat(node, 'parts');
        if(!this.isAttrValid(parts,null, 1,1)) return "Attribute parts in primitive ID = " + id + " invalid";

        var heightscale = this.reader.getInteger(node, 'heightscale');
        if(!this.isAttrValid(heightscale,null, 1,1)) return "Attribute heightscale in primitive ID = " + id + " invalid";

        this.primitives.push([id, new MyTerrain(this.scene, idtexture, idheightmap, parts, heightscale)]);
        return null; 
    }

    /**
     * Parses Water
     * @param {*} node
     * @param {*} id
     */
    parseWater(node, id){
        let temp = 0;
        var idtexture = this.reader.getString(node, 'idtexture');

        for(let i = 0; i< this.textures.length;i++){
            if(this.textures[i][0]==idtexture){
                 temp = 1;
                 break;
            }     
        }

        var idwavemap = this.reader.getString(node, 'idwavemap');
        if(!this.isAttrValid(idwavemap,null, 0,1)) return "Attribute idwavemap in primitive ID = " + id + " invalid";

        var parts = this.reader.getInteger(node, 'parts');
        if(!this.isAttrValid(parts,null, 1,1)) return "Attribute parts in primitive ID = " + id + " invalid";

        var heightscale = this.reader.getFloat(node, 'heightscale');
        if(!this.isAttrValid(heightscale,null, 1,1)) return "Attribute heightscale in primitive ID = " + id + " invalid";

        var texscale = this.reader.getFloat(node, 'texscale');
        if(!this.isAttrValid(texscale,null, 1,1)) return "Attribute texscale in primitive ID = " + id + " invalid";

        this.primitives.push([id, new MyWater(this.scene, idtexture, idwavemap, parts, heightscale, texscale)]);
        return null;
    }

    /**
     * Parses the <TRANSFORMATIONS> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode){
        this.transformations = [];
        var children = transformationsNode.children;
        var grandChildren = [];
        var nodeNames = [];
        var ids = [];
        var message = null;

         // Any number of transformations
        for (var i = 0; i < children.length; i++) {
            var nodeName = children[i].nodeName;
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
             // Get id of the current texture.
            var transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "no ID defined for transformation";

             // Checks for repeated IDs.
            if (this.existsID(ids, transformationId))
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";
                
             grandChildren = children[i].children;

            this.parseSingleTransformation(grandChildren, transformationId, message);
            if(message) return message;
            
            ids.push(transformationId);  
         }
      this.log("Parsed transformations");
     }

     /**
      * Parses a single transformation
      * @param {*} trfNodes 
      * @param {*} id 
      * @param {*} message
      */
     parseSingleTransformation(trfNodes, id){
        
         var trans = [];
         var ro = [];
         var sc = [];
         var transformation = []; 
         var matrix=null;

        for(var i = 0; i < trfNodes.length; i++){
            if(trfNodes[i].nodeName  == 'translate'){
               matrix = this.multiplyMatrixs(matrix,this.getTranformationMatrix('translate', trfNodes[i],id));

            }else if(trfNodes[i].nodeName  == 'scale'){
                matrix = this.multiplyMatrixs(matrix,this.getTranformationMatrix('scale', trfNodes[i],id));

            } else if(trfNodes[i].nodeName  == 'rotate'){
                matrix = this.multiplyMatrixs(matrix,this.getTranformationMatrix('rotate', trfNodes[i],id));
            }
        }

        if(id) this.transformations.push([id, matrix]);
        return matrix;
    }

    /**
     * Multiplies matrixs
     * @param {*} matrix1 
     * @param {*} matrix2 
     */
    multiplyMatrixs(matrix1, matrix2){
        if(matrix1) return mat4.multiply(matrix1 , matrix1, matrix2);
        else return matrix2;
    }

    /**
     * Applies transformations to matrix
     * @param {*} tagName 
     * @param {*} node 
     * @param {*} message 
     */
    getTranformationMatrix(tagName,node, id){
        var matrix = mat4.create();
        var temp = [];

        switch(tagName){
            case 'translate':
            temp = this.parseXYZ(node,"translate of transformation",id);
                return mat4.translate(matrix,matrix,temp);
            
            case 'scale':
            temp = this.parseXYZ(node,"scale of transformation",id); 
                return mat4.scale(matrix,matrix,temp);

            case 'rotate':
                var axis = this.reader.getString(node, 'axis',false);
                if(axis!='x' && axis!='y'&& axis!='z'){
                this.onXMLMinorError("Invalid attribute axis in rotate of transformation ID: " + id + ": assuming x.");
                axis = 'x';
                }
                if(axis == 'x') temp = [1,0,0];
                else if(axis == 'y') temp = [0,1,0];
                else if(axis == 'z') temp = [0,0,1];
                    
                var angle = this.reader.getFloat(node, 'angle')*DEGREE_TO_RAD;
                if(!this.isAttrValid(angle,0,1)) {
                    this.onXMLMinorError("Invalid attribute angle in rotate of transformation ID: " + id + ": assuming x.");
                    angle = '1';
                }
                return mat4.rotate(matrix,matrix,angle,temp);  
        }
    }

    /**
     * 
     * @param {*} node 
     */
     getChildrensNames(node){
        var nodeNames = [];
        for (var i=0; i<node.length;i++){
            nodeNames.push(node[i].nodeName);
        }
        return nodeNames;
    }

    /**
     * Parses the <COMPONENTS> node.
     * @param {*} componentsNode 
     */
     parseComponents(componentsNode){
         var components = componentsNode.children;
         var id, content, transformationsMatrix, textureInfo,children;
         var contentTagNames=[], component = [], materials= [], animations=[];
         this.components = [];
        

         for(var i = 0; i<components.length; i++){
             id=this.reader.getString(components[i],'id');
             component.push(id);
             content = components[i].children;
             contentTagNames = this.getChildrensNames(content);

             if(contentTagNames[0]!='transformation') return "Component (ID:" + id + " must have transformation tag";
             else{
                 if(content[0].children) transformationsMatrix = this.parseComponentTransformations(content[0].children,id);
             }

             if(contentTagNames[1]!='materials') return "Component (ID:" + id + " must have materials tag";
             else{
                materials = this.loadComponentMaterials(content[1].children);
            }
            
            if (contentTagNames[2]!='texture') return "Component (ID:" + id + " must have materials tag";
            else{
                var textId = this.reader.getString(content[2],'id');
                var texture = this.loadComponentTextures(content[2]);
                var length_s, length_t ;

                if(textId!="none" ){
                    length_s = this.reader.getString(content[2],'length_s',false);
                    length_t = this.reader.getString(content[2],'length_t',false);
                }

                textureInfo = [texture,length_s,length_t];
            }
            
            if (contentTagNames[3]!='children') return "Component (ID:" + id + " must have children tag";    
            else{
                children = this.parseChildren(content[3].children);
                }

            if(contentTagNames[4]=='animations'){
                console.log(id,"oi");
                animations = this.loadComponentAnimations(content[4].children);
               }

            let temp =  new MyComponent(this.scene,id,transformationsMatrix,materials,textureInfo,children, animations);
            animations = [];
            this.components.push(temp); 

            if(id == this.idRoot) this.rootNode = temp;
         }

         this.referenceComponents(); 
     }


     /**
      * Loads
      * @param {*} nodes 
      */
     loadComponentMaterials(nodes){
        var matId;
        var materials=[];

         for(let i = 0; i < nodes.length; i++){
                matId = this.reader.getString(nodes[i],'id',false);
                
                if(matId == "inherit") materials.push("inherit");
                else if(matId == "none") materials.push("none");
                else{
                    if(this.findGraphElement(this.materials,matId) == null){
                        materials.push(this.scene.defaultMaterial);
                    this.onXMLMinorError("Material id = "+ matId + " does not exist. Applying default material.")
                    } 
                    else materials.push(this.findGraphElement(this.materials,matId));
                } 
         }
         return materials;
     }

     /**
      * Loads
      * @param {*} nodes 
      */
     loadComponentAnimations(nodes){

        var aniId;
        var animations=[];

         for(let i = 0; i < nodes.length; i++){
            aniId = this.reader.getString(nodes[i],'id',false);
                
                if(aniId == "inherit") animations.push("inherit");
                else if(aniId == "none") animations.push("none");
                else if(aniId != null) animations.push(this.findGraphElement(this.animations,aniId));
         }
         return animations;
     }

     /**
      * Sets textures
      * @param {*} node 
      */
     loadComponentTextures(node){
        var textId;
        var texture;

        textId = this.reader.getString(node,'id',false);
        
        if(textId == "inherit") texture = "inherit";
        else if(textId == "none") texture="none";
        else{
            if(this.findGraphElement(this.textures,textId)==null)
            this.onXMLMinorError("Texture id = "+ textId + " does not exist.") 
            
            texture = this.findGraphElement(this.textures,textId);
        } 

         return texture;
     }

     /**
      * References components
      */
     referenceComponents(){
         var children = [];
         //go through components
         for(let i = 0; i < this.components.length; i++){
             var compRefs = this.components[i].childComponents;
             
             //go through a comonent's refs
             for(let j = 0; j < compRefs.length;j++){
                
                //go through components again to reference object
                for(let k = 0; k<this.components.length;k++){
                    if(this.components[k].id==compRefs[j]){
                        if(compRefs[j]==this.components[i].id){
                            this.onXMLMinorError("Component can't have itself as a child");
                        }
                        else children.push(this.components[k]); 
                    }
                }
            }
            this.components[i].childComponents = children;
            children = [];
        }
     }

     /**
      * Parses primitives children and components children
      * @param {*} nodes 
      */
     parseChildren(nodes){
         var primitiveChildren = [];
         var componentChildren = [];

         for(let i = 0; i< nodes.length; i++){
             if(nodes[i].nodeName == 'primitiveref'){
                 if(this.findGraphElement(this.primitives,this.reader.getString(nodes[i],'id'))!=null)
                 primitiveChildren.push(this.findGraphElement(this.primitives,this.reader.getString(nodes[i],'id')));
             } 
             else componentChildren.push(this.reader.getString(nodes[i],'id'));
         }
         return [primitiveChildren,componentChildren];
     }

     /**
      * Parses components transformations
      * @param {*} nodes 
      * @param {*} id
      */
     parseComponentTransformations(nodes,id){
        var matrixes = [];
        var transfNodes = [];
        var m;
        var flag = false;

        for(let i = 0; i<nodes.length;i++){
            if(nodes[i].nodeName== 'transformationref'){
               m = this.findGraphElement(this.transformations,this.reader.getString(nodes[i],'id'));
               matrixes.push(m);
            }else{
                transfNodes.push(nodes[i]);
                flag = true;
            }
        }
        
        if(flag){
            matrixes.push(this.parseSingleTransformation(transfNodes,id));
        } 
        m = mat4.create();

        for(let j = 0; j <matrixes.length ; j++){
            mat4.multiply(m,m,matrixes[j]);
        }
        return m;
     }

     /**
      * Finds element
      * @param {*} array
      * @param {*} id 
      */
     findGraphElement(array,id){

         for(let i = 0; i<array.length;i++){
             var e = array[i];
             if(e[0]==id) {
                 return e[1];
            }
        }
        return null;
     }

     /**
      * Changes all components material for key feature
      */
     changeMaterials(){

         for(let i = 0; i < this.components.length; i++){
             this.components[i].changeMaterial();
         }
     }

    /**
     * Check id id exists in the first element of the array's arrays
     * @param {*} array 
     * @param {*} id 
     */
    existsID(array, id){
        var temp;
        for(var i = 0; i<array.length;i++){
            if(array[0]==id) return true;
        }
        return false;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.rootNode.display();
    }

    updateScene(timePassed){
        if(!this.rootNode) return;
        this.rootNode.update(timePassed);
    }
}
