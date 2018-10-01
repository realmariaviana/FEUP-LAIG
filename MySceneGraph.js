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
        this.views = [this.perspectiveViews,this.orthoViews];

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
        var index;
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
        var index;
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
        var index;
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != ambient_index)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
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
    parseRGB(node){

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


    addArrayAttrToArray(array,attr){

        for(var i =0; i <array.length;i++){
            if( attr[0]== array[i]) return -1;
        }

        if(this.array.length==0)
            this.array[this.array.length]=attr;
        else this.array[this.array.length+1]=attr;
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

        if (this.defaultView == null)
                return "no default view defined for scene";

        var children = viewsNode.children;      
        var nodeNames= []; 

        for (var i=0; i<children.length;i++){
            nodeNames.push(children[i].nodeName);
        }
        for(var i=0; i<nodeNames.length;i++){

            if(i==0)

            if(nodeNames[i] == "perspective") this.parsePerspectiveView(children[i]);
            else if(nodeNames[i] == "ortho") this.parseOrthoView(children[i]);
            else{
                if(i==0) return "View tag is undefined";
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

        if(this.perspectiveViews.length==0)
            this.orthoViews[this.orthoViews.length]=view;
        else this.orthoViews[this.orthoViews.length+1]=view;

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
        view[5] = toCoords;
        view[4] = fromCoords;
        if(this.perspectiveViews.length==0)
            this.perspectiveViews[this.perspectiveViews.length]=view;
        else this.perspectiveViews[this.perspectiveViews.length+1]=view;

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
        if(this.parseRGB(ambientN) == -1) return "unable to parse R component of the ambient block";
         if(this.parseRGB(ambientN) == -2) return "unable to parse G component of the ambient block";
        else if(this.parseRGB(ambientN) == -3) return "unable to parse B component of the ambient block";
        else {
            for(var i = 0; i<3;i++)
            this.temp[i] = this.parseRGB(ambientN)[i];   
        }

       // A
      var a = this.reader.getFloat(ambientN, 'a');

      if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
        return "unable to parse A component of the ambient block";
            else
                this.temp[1] = a;
        }
        else
            return "ambient component undefined";

            
      //background
        if (backgroundN) {
            if(this.parseRGB(backgroundN) == -1) return "unable to parse R component of the ambient back block";
            else if(this.parseRGB(backgroundN) == -2) return "unable to parse G component of the ambient block";
            else if(this.parseRGB(backgroundN) == -3) return "unable to parse B component of the ambient block";
            else {
                for(var i = 0; i<3;i++)
                this.temp[i] = this.parseRGB(backgroundN)[i];   
            }

        
        // A
        var a = this.reader.getFloat(backgroundN, 'a');

        if (!this.isAttrValid(a,0,0,0,1))
          return "unable to parse A component of the ambient block";
            else
                this.temp[1] = a;
        }
          else
              return "background component undefined";

      this.log("Parsed ambient");

      return null;
    }

      /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            //Retrieve the diffuse component

            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            // Retrieve the specular component

            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specularillumination for ID = " + lightId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + lightId;

            // Store Light global information.
            this.lights[lightId] = [enableLight, positionLight, ambientIllumination, diffuseIllumination, specularIllumination];
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }



    parseLights(lightsNose){
        
        var children = lightsNose.children;      
        var nodeNames= []; 

        for (var i=0; i<children.length;i++){
            nodeNames.push(children[i].nodeName);
        }
        for(var i=0; i<nodeNames.length;i++){

            if(nodeNames[i] == "omni") this.log("omni");//this.parseOmniLights(children[i]);
            else if(nodeNames[i] == "spot") this.log("spot");//this.parseSpotLights(children[i]);
            else{
                if(i==0) return "View tag is undefined";
            }
        }

        return null;
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


