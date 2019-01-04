/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.menu = this.gui.addFolder('Menu');
        this.menu.open();
        this.menu.add(this.scene, 'newGame').name('new game');
        //this.menu.add(this.scene, 'Undo').name('Undo');
        this.gui.typeP1 = 'Human';
        this.gui.typeP1List = this.menu.add(this.gui, 'typeP1', ['Human', 'Bot']);

        this.gui.typeP2 = 'Human';
        this.gui.typeP2List = this.menu.add(this.gui, 'typeP2', ['Human', 'Bot']);


        this.gui.difficulty = 'easy';
        this.gui.diffList = this.menu.add(this.gui, 'difficulty', ['easy', 'medium']);


        this.gui.playTime=10;
        this.gui.add(this.gui, 'playTime', 1, 30);
        this.scenes = this.gui.addFolder("Scenes");
  	    //this.scenes.open();
    	this.gui.scene = 'sala';
  	    this.gui.sceneList = this.scenes.add(this.gui, 'scene', ['sala', 'casino']);
        this.gui.sceneList.onFinishChange(function(){
        this.removeFolder("Lights", this.gui);
  		this.scene.changeGraph(this.gui.scene + '.xml');
        this.scene.changeView(this.gui.view);
          }.bind(this))
          
        this.views = this.gui.addFolder("Views");
        this.views.open();
        this.gui.view = 'view1';
        this.gui.viewList = this.views.add(this.gui, 'view', ['view1', 'view2', 'player1', 'player2']);
        this.gui.viewList.onFinishChange(function(){
        this.scene.changeView(this.gui.view);
        }.bind(this))

        // add a group of controls (and open/expand by defult)

        return true;
    }
    

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        //group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} views
     */
    // addViewsGroup(views) {

    //     var group = this.gui.addFolder("Views");
    //     //group.open();

    //     const cameraIdArray = Object.keys(views);
    //     this.currentCameraId = this.scene.graph.defaultView;

    //     group.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val));
    // }

    removeFolder(name, parent) {
        if(!parent)
            parent = this.gui;
      var folder = parent.__folders[name];
      if (!folder) {
        return;
      }
      folder.close();
      parent.__ul.removeChild(folder.domElement.parentNode);
      delete parent.__folders[name];
      parent.onResize();
    };

    /**
      * init keyboard keys
      */

    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
      }

      /**
      * key held down
      * @param {*} event
      */
      processKeyDown(event) {}

      /**
      * M key held up
      * @param {*} event
      */
      processKeyUp(event) {
        if(event.code === "KeyM") this.scene.graph.changeMaterials();
         
      }

   };