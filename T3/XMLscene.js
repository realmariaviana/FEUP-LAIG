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
        this.texturesStack = [];
        this.materialsStack = [];
        this.defaultMaterial = new CGFappearance(this);
        this.lastUpdateTime = (new Date()).getTime();
        this.translations = [];
        this.animatedObjects = [];
        this.objects=[];
        this.setPickEnabled(true);
        this.playTime=10;
        this.gameTypeP1 = 0;
        this.gameTypeP2 = 0;
        this.gameBotDifficulty = null;
        
    }


    logPicking(){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
                    var customId = this.pickResults[i][1];
                    if(customId!=200) this.game.userPick(customId);
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                    
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.setUpdatePeriod(1 / 60 * 1000);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.surfaces = [];
        this.currentCamera ='view1';
        this.cameraAnimation = new CameraAnimation(this, this.currentCamera, this.currentCamera);
	};


    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(40, 10, 30),vec3.fromValues(0, 0, 0));
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
        if(id == this.graph.defaultView) this.selectView(id);

        }
    }

    /**
     * Selects the view.
     */
    selectView(id) {
        this.camera = this.views[id];
        this.interface.setActiveCamera(this.views[id]);
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

    /**
     * Calculates the light direction. Returns its coordinates
     */
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

        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axis_length);

        this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
        this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);

        // TODO: Change ambient and background details according to parsed graph

        this.initLights();
        //this.initViews();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
        
        this.interface.initKeys();

        this.sceneInited = true;
    }


    update(currTime){
        if(this.cameraAnimation) this.cameraAnimation.updateAnimation((currTime - this.lastUpdateTime)/1000);
        this.graph.updateScene((currTime - this.lastUpdateTime)/1000);
       
        if(this.game) this.game.update((currTime - this.lastUpdateTime)/1000);
        
        for(let i = 0; i<this.animatedObjects.length;i++){
            this.animatedObjects[i].update((currTime - this.lastUpdateTime)/1000)
        }

       this.lastUpdateTime = currTime;
    }

    changeGraph(filename){
        this.graph = new MySceneGraph(filename, this);
      }

      changeView(viewName){
        if(viewName == "view1"){
            this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
            this.cameraAnimation.done = false;
            this.currentCamera="view1";
          }
          else if(viewName == "view2"){
            if(this.graph.file_name == "sala.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="view2";
            }
            else if(this.graph.file_name == "casino.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="view2";
            }
          }
          else if(viewName == "view3"){
            if(this.graph.file_name == "sala.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="view3";
            }
            else if(this.graph.file_name == "casino.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="view3";
          }
          }
          else if(viewName == "player1"){
            if(this.graph.file_name == "sala.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="player1";
            }
            else if(this.graph.file_name == "casino.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="player1";
          }
          }
          else if(viewName == "player2"){
            if(this.graph.file_name == "sala.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="player2";
            }
            else if(this.graph.file_name == "casino.xml"){
              this.cameraAnimation = new CameraAnimation(this, this.currentCamera, viewName);
              this.cameraAnimation.done = false;
              this.currentCamera="player2";
          }
          }

    }


    typeToCode(type){
        if(type=='Human') return 0;
        else return 1;
    }

    difficultyToLevel(difficulty){
        if(difficulty=='Easy') return 1;
        else return 2;
    }

    newGame(){
        let typeP1 = this.typeToCode(this.interface.gui.typeP1);
        let typeP2 = this.typeToCode(this.interface.gui.typeP2);
        let difficulty = this.difficultyToLevel(this.interface.gui.difficulty);
        
        this.game = new MyGame(this, this.scoreboard,this.playTime, typeP1,typeP2,difficulty);
        this.changeView("player2");
    }

    undo(){
        this.game.undo();
    }

    /**
     * Displays the scene.
     */
    display() {

        this.logPicking();
	    this.clearPickRegistration();

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        // Initialize model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        // this.game.display();

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
        for (i =0; i<this.surfaces.length; i++) {
			this.pushMatrix();

			this.surfaces[i].display();
			this.popMatrix();
        }
        this.pushMatrix();
        if(this.graph.file_name == "casino.xml"){
            this.translate(4.7,2.5,4.7);
            this.scale(0.23,0.23,0.23);
            
        } else {
            this.translate(4,0.75,4);
            this.scale(0.35,0.35,0.35);
        }
        if(this.game) this.game.display();


        if (this.scoreboard){
            this.pushMatrix();
            if(this.graph.file_name == "sala.xml"){
                this.translate(-3.3,0,11);
                this.rotate(Math.PI/2, 0, 1, 0);
                
            } else {
                // this.translate(4,0.75,4);
                // this.scale(0.35,0.35,0.35);
            }
            this.rotate(-Math.PI/12, 1, 0, 0);
            this.registerForPick(200, this.scoreboard);
            this.scoreboard.display();
            this.popMatrix();

        } 
        this.popMatrix();

        let index=0,k;
        this.pushMatrix();
        this.translate(0.55, 0, 0.55);
       
        for (i =0; i<this.objects.length; i++) {
            this.pushMatrix();
            this.translate(i+i*0.1, 0, 0);

            for (k =0; k<this.objects[i].length; k++) {
                this.pushMatrix();
                this.scale(1.1,1,1.1);
                this.translate(0, 0, k);
                this.registerForPick(k*10+i, this.objects[i][k]);
                if(this.pickMode) 
                    this.objects[i][k].display();
                this.popMatrix();
                index++;
            }
            this.popMatrix();
        }
        this.popMatrix();

    

    
        // ---- END Background, camera and axis setup
    }


}
