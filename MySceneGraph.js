var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var scene_index = 0;
var views_index = 1;
var ambient_index = 2;
var lights_index = 3;
var textures_index = 4;
var materials_index = 5;
var transformations_index = 6;
var primitives_index = 7;
var components_index = 8;


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
    parseRGBA(node){

        var arr=[0,0,0];
        var temp;

        // R
        temp = this.reader.getFloat(node, 'r');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)) return -1;
        else arr[0] = temp;

        // G
        temp = this.reader.getFloat(node, 'g');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)) return -2;
        else arr[1] = temp;

        // B
        temp = this.reader.getFloat(node, 'b');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)) return -3;
        else arr[2] = temp;

        // B
        temp = this.reader.getFloat(node, 'a');
    
        if(!this.isAttrValid(temp,0,1,0,0,1)) return -4;
        else arr[3] = temp;

        return arr;        
    }

    /**
    * Parses x,y,z coordinates into an array
    * @param {*} node 
    */
    parseXYZ(node){

        var arr=[0,0,0];
        var temp;

        // X
        temp = this.reader.getFloat(node, 'x');
        if(!this.isAttrValid(temp,0,1,0,null,null)) return -1;
        else arr[0] = temp;

        // Y
        temp = this.reader.getFloat(node, 'y');
    
        if(!this.isAttrValid(temp,0,1,0,null,null)) return -2;
        else arr[1] = temp;

        // Z
        temp= this.reader.getFloat(node, 'z');

        if(!this.isAttrValid(temp,0,1,0,null,null)) return -3;
        else arr[2] = temp;

        return arr;        
    }

    /**
     * Parses the <scene> block.
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
     * Parses the <view> block.
     * @param {scene block element} sceneNode
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
            if(this.parseXYZ(fromNode) == -1) return "unable to parse x component of the views from block";
            else if(this.parseXYZ(fromNode) == -2) return "unable to parse y component of the views from block";
            else if(this.parseXYZ(fromNode) == -3) return "unable to parse z component of the views from block";
            else {
                for(var i = 0; i<3;i++)
                fromCoords[i] = this.parseXYZ(fromNode)[i];   
            }
            
        }

        //to
        if (toNode) {
            if(this.parseXYZ(toNode) == -1) return "unable to parse R component of the views to block";
            else if(this.parseXYZ(toNode) == -2) return "unable to parse G component of the views to block";
            else if(this.parseXYZ(toNode) == -3) return "unable to parse B component of the views to block";
            else {
                for(var i = 0; i<3;i++)
                toCoords[i] = this.parseXYZ(toNode)[i];   
            }
            
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

        if (fromNode) {
            if(this.parseXYZ(fromNode) == -1) return "unable to parse x component of the views from block";
            else if(this.parseXYZ(fromNode) == -2) return "unable to parse y component of the views from block";
            else if(this.parseXYZ(fromNode) == -3) return "unable to parse z component of the views from block";
            else {
                for(var i = 0; i<3;i++)
                fromCoords[i] = this.parseXYZ(fromNode)[i];   
            }
            
        }

        //to
        if (toNode) {
            if(this.parseXYZ(toNode) == -1) return "unable to parse R component of the views to block";
            else if(this.parseXYZ(toNode) == -2) return "unable to parse G component of the views to block";
            else if(this.parseXYZ(toNode) == -3) return "unable to parse B component of the views to block";
            else {
                for(var i = 0; i<3;i++)
                toCoords[i] = this.parseXYZ(toNode)[i];   
            }
            
        }

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
     * Parses the <ambient> node.
     * @param {ambient block element} ambientNode
     */
   parseAmbient(ambientNode){

      var ambientN = this.getChildNode(ambientNode, "ambient");
      var backgroundN = this.getChildNode(ambientNode, "background");

      this.ambient = [];
      this.background = [];

      //ambient
      if (ambientN) {

        //RBG
        if(this.parseRGBA(ambientN) == -1) return "unable to parse R component of the ambient block";
         if(this.parseRGBA(ambientN) == -2) return "unable to parse G component of the ambient block";
        else if(this.parseRGBA(ambientN) == -3) return "unable to parse B component of the ambient block";
        else if(this.parseRGBA(ambientN) == -4) return "unable to parse A component of the ambient block";
        else {
            for(var i = 0; i<4;i++)
            this.ambient[i] = this.parseRGBA(ambientN)[i];   
        }
    }
            
      //background
        if (backgroundN) {
            if(this.parseRGBA(backgroundN) == -1) return "unable to parse R component of the ambient back block";
            else if(this.parseRGBA(backgroundN) == -2) return "unable to parse G component of the ambient block";
            else if(this.parseRGBA(backgroundN) == -3) return "unable to parse B component of the ambient block";
            else if(this.parseRGBA(backgroundN) == -4) return "unable to parse A component of the ambient block";

            else {
                for(var i = 0; i<4;i++)
                this.background[i] = this.parseRGBA(backgroundN)[i];   
            }
        }

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
            var aux_light = this.reader.getFloat(children[i], 'enabled');
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
    
                if(this.parseXYZ(locationNode) == -1) return "unable to parse x component of the views from block";
                    else if(this.parseXYZ(locationNode) == -2) return "unable to parse y component of the views from block";
                    else if(this.parseXYZ(locationNode) == -3) return "unable to parse z component of the views from block";
                    else locationLight = this.parseXYZ(locationNode); 

                 // w
                var w = this.reader.getFloat(locationNode, 'w');
                if (w == null || isNaN(w) || w < 0 || w > 1)
                    return "unable to parse w-coordinate of the light location for ID = " + lightId;
                else locationLight.push(w);    
            }
            else
                return "light location undefined for ID = " + lightId;
    
            // Retrieves the ambient component.
            if (ambientNode) {
    
                if(this.parseRGBA(ambientNode) == -1) return "unable to parse R component of the ambient light for ID = " + lightId;
                else if(this.parseRGBA(ambientNode) == -2) return "unable to parse G component of the ambient light for ID = " + lightId;
                else if(this.parseRGBA(ambientNode) == -3) return "unable to parse B component of the ambient light for ID = " + lightId;
                else if(this.parseRGBA(ambientNode) == -4) return "unable to parse A component of the ambient light for ID = " + lightId;
                else ambientLight = this.parseRGBA(ambientNode);
            }
            else
                return "ambient component undefined for ID = " + lightId;
    
            //Retrieve the diffuse component
            if (diffuseNode) {
    
                if(this.parseRGBA(diffuseNode) == -1) return "unable to parse R component of the diffuse light for ID = " + lightId;
                else if(this.parseRGBA(diffuseNode) == -2) return "unable to parse G component of the diffuse light for ID = " + lightId;
                else if(this.parseRGBA(diffuseNode) == -3) return "unable to parse B component of the diffuse light for ID = " + lightId;
                else if(this.parseRGBA(diffuseNode) == -4) return "unable to parse A component of the diffuse light for ID = " + lightId;
                else diffuseLight = this.parseRGBA(diffuseNode);
                
            }
            else
                return "diffuse component undefined for ID = " + lightId;
    
            // Retrieve the specular component
            if (specularNode) {
    
                if(this.parseRGBA(specularNode) == -1) return "unable to parse R component of the specular light for ID = " + lightId;
                else if(this.parseRGBA(specularNode) == -2) return "unable to parse G component of the specular light for ID = " + lightId;
                else if(this.parseRGBA(specularNode) == -3) return "unable to parse B component of the specular light for ID = " + lightId;
                else if(this.parseRGBA(specularNode) == -4) return "unable to parse A component of the specular light for ID = " + lightId;
                else specularLight = this.parseRGBA(specularNode);
            }
            else
                return "specular component undefined for ID = " + lightId;


            //specific elements
            if (children[i].nodeName == "spot") {
                this.parseSpot(children[i], angle, exponent, targetLight);
                angle = this.parseSpot(children[i])[0];
                exponent = this.parseSpot(children[i])[1];
                targetLight = this.parseSpot(children[i])[2];
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
    parseSpot(spotNode) {

        var angle = this.reader.getFloat(spotNode, 'angle')*DEGREE_TO_RAD;
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
        if (targetNode) {

            if(this.parseXYZ(targetNode) == -1) return "unable to parse x component of the views from block";
                else if(this.parseXYZ(targetNode) == -2) return "unable to parse y component of the views from block";
                else if(this.parseXYZ(targetNode) == -3) return "unable to parse z component of the views from block";
                else target = this.parseXYZ(targetNode); 
        }
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
     * Parses Materials
     * @param {*} materialsNode 
     */
    parseMaterials(materialsNode){
        var children = materialsNode.children;      
        var nodeNames= [], ids = [], matId;

        nodeNames= this.getChildrensNames(children);

        for(var i=0; i<nodeNames.length;i++){
            if(nodeNames[i] == "material"){
                matId = this.reader.getString(children[i], 'id');

                if (this.existsID(ids, matId)) return "ID must be unique for each material (conflict: ID = " + matId + ")";
                else {this.parseMaterial(children[i], matId, this.reader.getString(children[i],"shininess"));
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

        //RBG emission
        if(this.parseRGBA(emissionN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(emissionN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(emissionN) == -3) return "unable to parse B component of the  material id= " + id;
        else emission = this.parseRGBA(emissionN);   

        temp.setEmission(emission[0],emission[1], emission[2],emission[3]);

        //RBG ambientN
        if(this.parseRGBA(ambientN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(ambientN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(ambientN) == -3) return "unable to parse B component of the  material id= " + id;
        else ambient = this.parseRGBA(ambientN); 

        temp.setAmbient(ambient[0],ambient[1], ambient[2],ambient[3]);

        //RBG diffuseN
        if(this.parseRGBA(diffuseN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(diffuseN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(diffuseN) == -3) return "unable to parse B component of the  material id= " + id;
        else  diffuse = this.parseRGBA(diffuseN);
        
        temp.setDiffuse(diffuse[0],diffuse[1], diffuse[2],diffuse[3]);

        //RBG specularN
        if(this.parseRGBA(specularN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(specularN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(specularN) == -3) return "unable to parse B component of the  material id= " + id;
        else specular= this.parseRGBA(specularN);   
        
        temp.setSpecular(specular[0],specular[1], specular[2],specular[3]);
        this.materials.push([id,temp]);

    }

    /**
     * Parses Primitives
     * @param {*} primitivesNode 
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

                //parse primitive
                var control = this.primitiveHandler(primitive[0],pID);
                if(control!=null) return control;


            } 
            else this.onXMLMinorError("unknown tag <" + primitives[i].nodeName + ">");
        }
        this.log("Parsed Primitives");
    }

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
        }
    }

    /**
     * Parses Rectangle
     * @param {*} node
     * * @param {*} id
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
     * * @param {*} id
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
     * * @param {*} id
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
     * * @param {*} id
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
     * * @param {*} id
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
      * 
      * @param {*} trfNodes 
      * @param {*} id 
      */
     parseSingleTransformation(trfNodes, id, message){
        
         var trans = [];
         var ro = [];
         var sc = [];
         var transformation = []; 
         var matrix=null;

        for(var i = 0; i < trfNodes.length; i++){
            if(trfNodes[i].nodeName  == 'translate'){
               matrix = this.multiplyMatrixs(matrix,this.getTranformationMatrix('translate', trfNodes[i],message));

            }else if(trfNodes[i].nodeName  == 'scale'){
                matrix = this.multiplyMatrixs(matrix,this.getTranformationMatrix('scale', trfNodes[i],message));

            } else if(trfNodes[i].nodeName  == 'rotate'){
                matrix = this.multiplyMatrixs(matrix,this.getTranformationMatrix('rotate', trfNodes[i],message));
            }
        }

        if(id) this.transformations.push([id, matrix]);
        return matrix;
    }


    /**
     * 
     * @param {*} matrix1 
     * @param {*} matrix2 
     */
    multiplyMatrixs(matrix1, matrix2){
        if(matrix1) return mat4.multiply(matrix1 , matrix1, matrix2);
        else return matrix2;
    }

    /**
     * 
     * @param {*} tagName 
     * @param {*} node 
     * @param {*} message 
     */
    getTranformationMatrix(tagName,node, message){
        var matrix = mat4.create();
        var temp = [];

        switch(tagName){
            case 'translate':
                if(this.parseXYZ(node) == -1) message = "unable to parse x component of the transformations from block";
                    else if(this.parseXYZ(node) == -2) message= "unable to parse y component of the transformations from block";
                    else if(this.parseXYZ(node) == -3) message= "unable to parse z component of the transformations from block";
                    else {
                        for(var j = 0; j<3;j++){
                            temp[j] = this.parseXYZ(node)[j]; 
                        }
                    } 
                return mat4.translate(matrix,matrix,temp);
            
            case 'scale':
                if(this.parseXYZ(node) == -1) message= "unable to parse x component of the transformations from block";
                else if(this.parseXYZ(node) == -2) message= "unable to parse y component of the transformations from block";
                else if(this.parseXYZ(node) == -3) message= "unable to parse z component of the transformations from block";
                else {
                    for(var j = 0; j<3;j++){
                        temp[j] = this.parseXYZ(node)[j];  
                    }
                }  
                return mat4.scale(matrix,matrix,temp);

            case 'rotate':
                var axis = this.reader.getString(node, 'axis');
                if (axis == null) this.onXMLMinorError("unable to parse rotation axis");

                if(axis == 'x') temp = [1,0,0];
                else if(axis == 'y') temp = [0,1,0];
                else if(axis == 'z') temp = [0,0,1];
                    
                var angle = this.reader.getFloat(node, 'angle')*DEGREE_TO_RAD;
                if(!this.isAttrValid(angle,0,1)) message= "unable to parse angle of the transformations from block";
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
     * 
     * @param {*} componentsNode 
     */
     parseComponents(componentsNode){
         var components = componentsNode.children;
         var id, content, transformationsMatrix, textureInfo,children;
         var contentTagNames=[], component = [], materials= [];
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
                var length_s = this.reader.getString(content[2],'length_s');
                var length_t = this.reader.getString(content[2],'length_t');
                textureInfo = [texture,length_s,length_t];
            }
            
            if (contentTagNames[3]!='children') return "Component (ID:" + id + " must have children tag";    
            else{
                children = this.parseChildren(content[3].children);
                }

            this.components.push(new MyComponent(this.scene,id,transformationsMatrix,materials,textureInfo,children)); 
         }
         this.referenceComponents(); 
     }



     /**
      * 
      * @param {*} nodes 
      */
     loadComponentMaterials(nodes){
        var matId;
        var materials=[];

         for(let i = 0; i < nodes.length; i++){
                matId = this.reader.getString(nodes[i],'id');
                if(matId == "inherit") materials.push("inherit");
                else if(matId == "none") materials.push("none");
                else materials.push(this.findGraphElement(this.materials,matId));
         }
         return materials;
     }


     loadComponentTextures(node){
        var textId;
        var texture;

        textId = this.reader.getString(node,'id');
        
        if(textId == "inherit") texture = "inherit";
        else if(textId == "none") texture="none";
        else texture = this.findGraphElement(this.textures,textId);

         return texture;
     }



    
     /**
      * 
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
                        children.push(this.components[k]); 
                    }
                }
            }
            this.components[i].childComponents = children;
            children = [];
        }
     }

     /**
      * 
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
      * 
      * @param {*} nodes 
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
            matrixes.push(this.parseSingleTransformation(transfNodes,id,null));
        } 
        m = mat4.create();

        for(let j = 0; j <matrixes.length ; j++){
            mat4.multiply(m,m,matrixes[j]);
        }
        return m;
     }

     /**
      * 
      * @param {*} red 
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
            this.components[0].display();
    }
}
