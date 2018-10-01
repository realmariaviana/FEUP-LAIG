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
    }

    isAttrValid(attribute, canBeNull, isNumber, limit1, limit2){
        if((!canBeNull && attribute==null) 
            || (isNumber && isNaN(attribute))
            || (limit1!=null && attribute < limit1)
            || (limit2!=null && attribute > limit2)) 
            
            return null;
        else return 1;    
    }


    parseRGB(node){

        var arr=[0,0,0];

        // R
        var r = this.reader.getFloat(node, 'r');
    
        if(!this.isAttrValid(r,0,1,0,1)) return -1;
        else arr[0] = r;

        // G
        var g = this.reader.getFloat(node, 'g');
    
        if(!this.isAttrValid(g,0,1,0,1)) return -2;
        else arr[1] = g;

        // B
        var b = this.reader.getFloat(node, 'b');
    
        if(!this.isAttrValid(b,0,1,0,1)) return -3;
        else arr[2] = b;

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
        this.viewId = this.reader.getString(viewsNode, 'default');

        if (this.viewId == null)
                return "no default defined for scene";

        //perspective        
        var perspectiveNode = viewsNode.children[0];
        this.idPerspective = this.reader.getString(perspectiveNode, 'id');
        this.near = this.reader.getString(perspectiveNode, 'near');
        this.far = this.reader.getString(perspectiveNode, 'far');
        this.angle = this.reader.getString(perspectiveNode, 'angle');

        //perspective's children
        var children = perspectiveNode.children;

        var nodeNames= [];

        for (var i=0; i<children.length;i++){
            nodeNames.push(children[i].nodeName);
        }

        var toIndex = nodeNames.indexOf("to");
        var fromIndex = nodeNames.indexOf("from");

        this.toCoords = [0, 0, 0];
        this.fromCoords = [0, 0, 0];

        //x
        if (fromIndex!= -1) {
            if(this.parseXYZ(children[fromIndex]) == -1) return "unable to parse x component of the views from block";
            else if(this.parseXYZ(children[fromIndex]) == -2) return "unable to parse y component of the views from block";
            else if(this.parseXYZ(children[fromIndex]) == -3) return "unable to parse z component of the views from block";
            else {
                for(var i = 0; i<3;i++)
                this.fromCoords[i] = this.parseXYZ(children[fromIndex])[i];   
            }
            
        }


        //to
        //x
        if (toIndex!= -1) {
            if(this.parseXYZ(children[toIndex]) == -1) return "unable to parse R component of the views to block";
            else if(this.parseXYZ(children[toIndex]) == -2) return "unable to parse G component of the views to block";
            else if(this.parseXYZ(children[toIndex]) == -3) return "unable to parse B component of the views to block";
            else {
                for(var i = 0; i<3;i++)
                this.toCoords[i] = this.parseXYZ(children[toIndex])[i];   
            }
            
        }

        this.log("Parsed views");

        return null;

    }


    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientNode
     */
   parseAmbient(ambientNode){

      var children = ambientNode.children;
      var nodeNames= [];

      for (var i=0; i<children.length;i++){
        nodeNames.push(children[i].nodeName);
      }

      var ambientIndex = nodeNames.indexOf("ambient");
      this.temp = [0, 0, 0, 1];
      var backgroundIndex = nodeNames.indexOf("background");

      //ambient
      if (ambientIndex!= -1) {

        //RBG
        if(this.parseRGB(children[ambientIndex]) == -1) return "unable to parse R component of the ambient block";
         if(this.parseRGB(children[ambientIndex]) == -2) return "unable to parse G component of the ambient block";
        else if(this.parseRGB(children[ambientIndex]) == -3) return "unable to parse B component of the ambient block";
        else {
            for(var i = 0; i<3;i++)
            this.temp[i] = this.parseRGB(children[ambientIndex])[i];   
        }

       // A
      var a = this.reader.getFloat(children[ambientIndex], 'a');

      if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
        return "unable to parse A component of the ambient block";
            else
                this.temp[1] = a;
        }
        else
            return "ambient component undefined";

            
      //background
        if (backgroundIndex!= -1) {
            if(this.parseRGB(children[backgroundIndex]) == -1) return "unable to parse R component of the ambient block";
            else if(this.parseRGB(children[backgroundIndex]) == -2) return "unable to parse G component of the ambient block";
            else if(this.parseRGB(children[backgroundIndex]) == -3) return "unable to parse B component of the ambient block";
            else {
                for(var i = 0; i<3;i++)
                this.temp[i] = this.parseRGB(children[backgroundIndex])[i];   
            }

        
        // A
        var a = this.reader.getFloat(children[backgroundIndex], 'a');

        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
          return "unable to parse A component of the ambient block";
            else
                this.temp[1] = a;
        }
          else
              return "background component undefined";

      this.log("Parsed ambient");

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


