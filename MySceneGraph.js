var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var ILLUMINATION_INDEX = 1;
var LIGHTS_INDEX = 2;
var TEXTURES_INDEX = 3;
var MATERIALS_INDEX = 4;
var NODES_INDEX = 5;

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

        // <views>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse INITIAL block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }
    }



    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {


        // Get root - still don't know where to store this
            var root = this.reader.getString(sceneNode, 'root');
            if (root == null)
                return "no root defined for scene";


            var axis_length = this.reader.getString(sceneNode, 'axis_length');
            if (axis_length == null || isNaN(axis_length))
                return "no axis_length defined for scene";

        this.log("Parsed scene");

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
      var backgroundIndex = nodeNames.indexOf("background");

      //ambient

      this.ambientAmbient = [0, 0, 0, 1];

      if (ambientIndex!= -1) {
      // R
      var r = this.reader.getFloat(children[ambientIndex], 'r');

      if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
        return "unable to parse R component of the ambient block";
          else
              this.ambientAmbient[0] = r;
      // G
      var g = this.reader.getFloat(children[ambientIndex], 'g');

      if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
        return "unable to parse G component of the ambient block";
            else
                this.ambientAmbient[1] = g;
       // B
      var b = this.reader.getFloat(children[ambientIndex], 'b');

      if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
        return "unable to parse B component of the ambient block";
            else
                this.ambientAmbient[2] = b;
       // A
      var a = this.reader.getFloat(children[ambientIndex], 'a');

      if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
        return "unable to parse A component of the ambient block";
            else
                this.ambientAmbient[1] = a;
        }
        else
            return "ambient component undefined";

      //background
      this.backgroundAmbient = [0, 0, 0, 1];

        if (backgroundIndex!= -1) {
        // R
        var r = this.reader.getFloat(children[backgroundIndex], 'r');

        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
          return "unable to parse R component of the ambient block";
            else
                this.backgroundAmbient[0] = r;
        // G
        var g = this.reader.getFloat(children[backgroundIndex], 'g');

        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
          return "unable to parse G component of the ambient block";
            else
                this.backgroundAmbient[1] = g;
        // B
        var b = this.reader.getFloat(children[backgroundIndex], 'b');

        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
          return "unable to parse B component of the ambient block";
            else
                this.backgroundAmbient[2] = b;
        // A
        var a = this.reader.getFloat(children[backgroundIndex], 'a');

        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
          return "unable to parse A component of the ambient block";
            else
                this.backgroundAmbient[1] = a;
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
