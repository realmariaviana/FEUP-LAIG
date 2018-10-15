var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.views = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene views.
     */
    initViews() {

        var views = this.graph.views;
        
        for(var id in views){
            if(views[id].type == "perspective"){
                this.views[id] = new CGFcamera(views[id][2]*DEGREE_TO_RAD, views[id][0], views[id][1], vec3.fromValues(views[id][4][0], views[id][4][1], views[id][4][2]), vec3.fromValues(views[id][3][0], views[id][3][1], views[id][3][2]));
            }

            if(views[id].type == "ortho"){
                var o = views[id][7];
                this.views[id] = new CGFcameraOrtho(views[id][2],views[id][3],views[id][5],views[id][4],views[id][0],views[id][1], vec3.fromValues(o[0], o[1], o[2]), vec3.fromValues(views[id][6][0], views[id][6][1], views[id][6][2]), vec3.fromValues(0, 1, 0));
            }
        }
    }

    selectView(id) {
        this.camera = this.views[id];
        this.interface.setActiveCamera(this.camera);
        console.log(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                this.lights[i].setVisible(true);

                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();
                    
                if(light[5]!=null){
                    this.lights[i].setSpotCutOff(light[5]);
                    this.lights[i].setSpotExponent(light[6]);
                    this.lights[i].setSpotExponent(this.calculateLightDirection(light[1], light[6]));
                }
                this.lights[i].update();

                i++;
            }
        }
    }


    calculateLightDirection(pos,target){
        let x, y, z;

        x = (target[0]-pos[0]);
        y = (target[1]-pos[1]);
        z = (target[2]-pos[2]);

        return [x,y,z];
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.camera.setPosition(this.graph.position);
        this.camera.setTarget(this.graph.target);

        this.camera.near = parseFloat(this.graph.near);
        this.camera.far = parseFloat(this.graph.far);
        this.camera.fov = this.graph.angle * DEGREE_TO_RAD;


        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axis_length);

        this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
        this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);

        // TODO: Change ambient and background details according to parsed graph
        
        this.initLights();
        this.initViews();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
        this.interface.addViewsGroup(this.views);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
