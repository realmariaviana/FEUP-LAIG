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

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.perspectiveViews = [];
        this.orthoViews = [];
        this.views = [this.perspectiveViews, this.orthoViews ];

        this.materials = [];
        this.textures = [];
        this.lights=[];

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
        //this.scene.onGraphLoaded();
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

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

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
    isAttrValid(attribute, canBeNull, isNumber, limit1, limit2){
        if((!canBeNull && attribute==null) 
            || (isNumber && isNaN(attribute))
            || (limit1!=null && attribute < limit1)
            || (limit2!=null && attribute > limit2)) 
            
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
    
        if(!this.isAttrValid(temp,0,1,0,1)) return -1;
        else arr[0] = temp;

        // G
        temp = this.reader.getFloat(node, 'g');
    
        if(!this.isAttrValid(temp,0,1,0,1)) return -2;
        else arr[1] = temp;

        // B
        temp = this.reader.getFloat(node, 'b');
    
        if(!this.isAttrValid(temp,0,1,0,1)) return -3;
        else arr[2] = temp;

        // B
        temp = this.reader.getFloat(node, 'a');
    
        if(!this.isAttrValid(temp,0,1,0,1)) return -4;
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
        if(!this.isAttrValid(temp,0,1,null,null)) return -1;
        else arr[0] = temp;

        // Y
        temp = this.reader.getFloat(node, 'y');
    
        if(!this.isAttrValid(temp,0,1,null,null)) return -2;
        else arr[1] = temp;

        // Z
        temp= this.reader.getFloat(node, 'z');

        if(!this.isAttrValid(temp,0,1,null,null)) return -3;
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

        for (var i=0; i<children.length;i++){
            nodeNames.push(children[i].nodeName);
        }
        for(var i=0; i<nodeNames.length;i++){
            id = this.reader.getString(children[i], 'id');

            //check is is unique
            if (this.existsID( ids, this.reader.getString(children[i], "id"))) 
                return "ID must be unique for each view (conflict: ID = " + id + ")";
            else{
                if(nodeNames[i] == "perspective") {this.parsePerspectiveView(children[i]); ids.push(id);}
                else if(nodeNames[i] == "ortho") {this.parseOrthoView(children[i]);ids.push(id);}
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

        var view=[];

        var viewId = this.reader.getString(orthoNode, 'id');
        var near = this.reader.getString(orthoNode, 'near');
        var far = this.reader.getString(orthoNode, 'far');
        var left = this.reader.getString(orthoNode, 'left');
        var right = this.reader.getString(orthoNode, 'right');
        var top = this.reader.getString(orthoNode, 'top');
        var bottom = this.reader.getString(orthoNode, 'bottom');

        view[0] = viewId;
        view[1]=near;
        view[2]=far;
        view[3]=left;
        view[4]=right;
        view[5]=top;
        view[6]=bottom;

        this.orthoViews[this.orthoViews.length+1] = view;

        this.log("Parsed ortho view")
    }

    /**
     * Parses a perspective view 
     * @param {*} perspectiveNode 
     */
    parsePerspectiveView(perspectiveNode){
        var idView = this.reader.getString(perspectiveNode, 'id');
        var near = this.reader.getString(perspectiveNode, 'near');
        var far = this.reader.getString(perspectiveNode, 'far');
        var angle = this.reader.getString(perspectiveNode, 'angle');

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

        var view=[];
        view[0]=idView;
        view[1]=near;
        view[2] = far;
        view[3] = angle;
        view[4] = toCoords;
        view[5] = fromCoords;
        this.perspectiveViews[this.perspectiveViews.length+1]=view;

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

        for (var i=0; i<children.length;i++){
            nodeNames.push(children[i].nodeName);
        }

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

      this.temp = [0, 0, 0, 1];

      //ambient
      if (ambientN) {

        //RBG
        if(this.parseRGBA(ambientN) == -1) return "unable to parse R component of the ambient block";
         if(this.parseRGBA(ambientN) == -2) return "unable to parse G component of the ambient block";
        else if(this.parseRGBA(ambientN) == -3) return "unable to parse B component of the ambient block";
        else if(this.parseRGBA(ambientN) == -4) return "unable to parse A component of the ambient block";
        else {
            for(var i = 0; i<4;i++)
            this.temp[i] = this.parseRGBA(ambientN)[i];   
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
                this.temp[i] = this.parseRGBA(backgroundN)[i];   
            }
        }

      this.log("Parsed ambient");

      return null;
    }

    /**
     * Parses a omni light
     * @param {*} omniNode 
     */
    parseOmni(omniNode) {
        var numLights = 0;

        // Get id of the current light.
        var lightId = this.reader.getString(omniNode, 'id');
        if (lightId == null)
            return "no ID defined for light";

        // Checks for repeated IDs.
        if (this.lights[lightId] != null)
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";

        var grandChildren = [];
        var nodeNames = [];
        grandChildren = omniNode.children;
       
        // Specifications for the current light

        // Light enable/disable
        var enableLight = true;
        var aux_light = this.reader.getFloat(omniNode, 'enabled');
        if(aux_light==null)
            this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
        else
        {
            if (!(aux_light != null && !isNaN(aux_light) && (aux_light == 0 || aux_light == 1)))
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
        else
            enableLight = aux_light == 0 ? false : true;
        }

        nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
            this.log(grandChildren[j].nodeName);
        }

        // Gets indices of each element.
        var locationIndex = nodeNames.indexOf("location");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        // Retrieves the light position.
        var locationLight = [];
        if (locationIndex != -1) {
            // x
            var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
            if (!(x != null && !isNaN(x)))
                return "unable to parse x-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(x);

            // y
            var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
            if (!(y != null && !isNaN(y)))
                return "unable to parse y-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(y);

            // z
            var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
            if (!(z != null && !isNaN(z)))
                return "unable to parse z-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(z);

            // w
            var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
            if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                return "unable to parse x-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(w);
        }
        else
            return "light location undefined for ID = " + lightId;

        // Retrieves the ambient component.
        var ambientLight = [];
        if (ambientIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(g);

            // B
            var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(b);

            // A
            var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(a);
        }
        else
            return "ambient component undefined for ID = " + lightId;

        //Retrieve the diffuse component

        var diffuseLight = [];
        if (diffuseIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(g);

            // B
            var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(b);

            // A
            var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(a);
        }
        else
            return "diffuse component undefined for ID = " + lightId;

        // Retrieve the specular component

        var specularLight= [];
        if (specularIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the specular light for ID = " + lightId;
            else
            specularLight.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the specular light for ID = " + lightId;
            else
            specularLight.push(g);

            // B
            var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the specular light for ID = " + lightId;
            else
            specularLight.push(b);

            // A
            var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the specular light for ID = " + lightId;
            else
            specularLight.push(a);
        }
        else
            return "specular component undefined for ID = " + lightId;

        // Store Light global information.
        this.lights[lightId] = [enableLight, locationLight, ambientLight, diffuseLight, specularLight];
        numLights++;

        console.log("Parsed omni light");
    }

    /**
     * Parses a spot light
     * @param {*} spotNode 
     */
    parseSpot(spotNode) {
        var numLights = 0;

        // Get id of the current light.
        var lightId = this.reader.getString(spotNode, 'id');
        if (lightId == null)
            return "no ID defined for light";

        // Checks for repeated IDs.
        if (this.lights[lightId] != null)
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";

        var grandChildren = [];
        var nodeNames = [];
        grandChildren = spotNode.children;
       
        // Specifications for the current light

        // Light enable/disable
        var enableLight = true;
        var aux_light = this.reader.getFloat(spotNode, 'enabled');
        if(aux_light==null)
            this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
        else
        {
            if (!(aux_light != null && !isNaN(aux_light) && (aux_light == 0 || aux_light == 1)))
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
        else
            enableLight = aux_light == 0 ? false : true;
        }

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

        nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
            this.log(grandChildren[j].nodeName);
        }

        // Gets indices of each element.
        var locationIndex = nodeNames.indexOf("location");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        // Retrieves the light position.
        var locationLight = [];
        if (locationIndex != -1) {
            // x
            var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
            if (!(x != null && !isNaN(x)))
                return "unable to parse x-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(x);

            // y
            var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
            if (!(y != null && !isNaN(y)))
                return "unable to parse y-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(y);

            // z
            var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
            if (!(z != null && !isNaN(z)))
                return "unable to parse z-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(z);

            // w
            var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
            if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                return "unable to parse x-coordinate of the light location for ID = " + lightId;
            else
            locationLight.push(w);
        }
        else
            return "light location undefined for ID = " + lightId;

        // Retrieves the ambient component.
        var ambientLight = [];
        if (ambientIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(g);

            // B
            var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(b);

            // A
            var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the ambient light for ID = " + lightId;
            else
            ambientLight.push(a);
        }
        else
            return "ambient component undefined for ID = " + lightId;

        //Retrieve the diffuse component

        var diffuseLight = [];
        if (diffuseIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(g);

            // B
            var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(b);

            // A
            var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the diffuse light for ID = " + lightId;
            else
            diffuseLight.push(a);
        }
        else
            return "diffuse component undefined for ID = " + lightId;

        // Retrieve the specular component

        var specularLight= [];
        if (specularIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the specular light for ID = " + lightId;
            else
            specularLight.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the specular light for ID = " + lightId;
            else
            specularLight.push(g);

            // B
            var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the specular light for ID = " + lightId;
            else
            specularLight.push(b);

            // A
            var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the specular light for ID = " + lightId;
            else
            specularLight.push(a);
        }
        else
            return "specular component undefined for ID = " + lightId;

        // Store Light global information.
        this.lights[lightId] = [enableLight, locationLight, ambientLight, diffuseLight, specularLight, angle, exponent];
        numLights++;
    
        console.log("Parsed spot light");
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     *
     */
    parseLights(lightsNode) {
 
        var children = lightsNode.children;
 
        this.lights = [];
        
 
        // Any number of omnis.
        for (var i = 0; i < children.length; i++) {
 
            if (children[i].nodeName == "omni") {
                
                this.parseOmni(children[i]);
            }
            else if (children[i].nodeName == "spot"){
                this.parseSpot(children[i]);
            }
            else {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
        }
    }
    
    /**
     * Parses the <TEXTURES> node.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var ids = [];
        var children = texturesNode.children;
        var oneTextureDefined = false;

        // Any number of texture.
        for (var i = 0; i < children.length; i++) {
            var nodeName = children[i].nodeName;
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
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
            var texture = new CGFtexture(this.scene,"./scenes/images/" + textureFile);
            ids.push(textureId);
            this.textures.push(texture);    
            oneTextureDefined = true;
            }
        }

        if (!oneTextureDefined)
            return "at least one texture must be defined in the TEXTURES block";

     console.log("Parsed textures");
    }

    /**
     * Parses Materials
     * @param {*} materialsNode 
     */
    parseMaterials(materialsNode){
        var children = materialsNode.children;      
        var nodeNames= []; 
        var ids = [];
        var matId;

        for (var i=0; i<children.length;i++){
            nodeNames.push(children[i].nodeName);
        }
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
        
        var emission=[];
        var ambient=[];
        var diffuse=[];
        var specular=[];
        var emissionN = this.getChildNode(materialNode, "emission");
        var ambientN = this.getChildNode(materialNode, "ambient");
        var diffuseN = this.getChildNode(materialNode, "diffuse");
        var specularN = this.getChildNode(materialNode, "specular");

        //RBG emission
        if(this.parseRGBA(emissionN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(emissionN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(emissionN) == -3) return "unable to parse B component of the  material id= " + id;
        else {
            for(var i = 0; i<3;i++){
            emission[i] = this.parseRGBA(emissionN)[i];   
            }
        }

        //RBG ambientN
        if(this.parseRGBA(ambientN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(ambientN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(ambientN) == -3) return "unable to parse B component of the  material id= " + id;
        else {
            for(var i = 0; i<3;i++){
                ambient[i] = this.parseRGBA(ambientN)[i];   
            }
        }

        //RBG diffuseN
        if(this.parseRGBA(diffuseN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(diffuseN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(diffuseN) == -3) return "unable to parse B component of the  material id= " + id;
        else {
            for(var i = 0; i<3;i++){
                diffuse[i] = this.parseRGBA(diffuseN)[i];   
            }
        }

        //RBG specularN
        if(this.parseRGBA(specularN) == -1) return "unable to parse R component of the  material id= " + id;
         if(this.parseRGBA(specularN) == -2) return "unable to parse G component of the  material id= " + id;
        else if(this.parseRGBA(specularN) == -3) return "unable to parse B component of the  material id= " + id;
        else {
            for(var i = 0; i<3;i++){
                specular[i] = this.parseRGBA(specularN)[i];   
            }
        }

        var temp;
        temp = new CGFappearance(ambient, diffuse,specular, shininess);
        
        this.materials.push(temp);

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
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}
