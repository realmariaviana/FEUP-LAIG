class CameraAnimation{
    /**
     * CameraAnimation constructor
     * @param scene CGFscene where the component will be displayed
     * @param initialView position where the animation begins
     * @param finalView final position of the camara
     */
constructor (scene, initialView, finalView){
    this.scene=scene;
    this.span=1;

    //InicialPosition
    if(initialView == "view1"){
      this.initialPosition=[35,15,30];
      this.initialTarget= [0,0,0];
    }
    else if(initialView == "view2"){
      if(this.scene.graph.file_name == "sala.xml"){
        this.initialPosition=[18,15,13];
        this.initialTarget=[4,-2,4];
      }
      else if(this.scene.graph.file_name == "casino.xml"){
        this.initialPosition= [20,15,30];
        this.initialTarget=[10,0,0];
      }
    }
    else if(initialView == "player1"){
        if(this.scene.graph.file_name == "sala.xml"){
          this.initialPosition=[6,15,14];
          this.initialTarget=[6,-70,-35];
        }
        else if(this.scene.graph.file_name == "casino.xml"){
          this.initialPosition= [5,10,20];
          this.initialTarget=[12,0,5];
        }
      }
      else if(initialView == "player2"){
        if(this.scene.graph.file_name == "sala.xml"){
            this.initialPosition=[7,10,-5];
          this.initialTarget=[-30,-60,75];
        }
        else if(this.scene.graph.file_name == "casino.xml"){
          this.initialPosition= [17,10,20];
          this.initialTarget=[12,0,5];
        }
      }
  
    //FinalPosition
    if(finalView == "view1"){
      this.finalPosition=[35,15,30];
      this.finalTarget=[0,0,0];
    }
    else if(finalView == "view2"){
      if(this.scene.graph.file_name == "sala.xml"){
        this.finalPosition=[18,15,13];
        this.finalTarget=[4,-2,4];
      }
      else if(this.scene.graph.file_name == "casino.xml"){
        this.finalPosition=[20,15,30];
        this.finalTarget=[10,0,0];
      }
    }
    else if(finalView == "player1"){
        if(this.scene.graph.file_name == "sala.xml"){
          this.finalPosition=[6,15,14];
          this.finalTarget=[6,-70,-35];
        }
        else if(this.scene.graph.file_name == "casino.xml"){
          this.finalPosition=[5,10,20];
          this.finalTarget=[12,0,5];
        }
      }
      else if(finalView == "player2"){
        if(this.scene.graph.file_name == "sala.xml"){
          this.finalPosition=[7,10,-5];
          this.finalTarget=[5,-60,80];
        }
        else if(this.scene.graph.file_name == "casino.xml"){
          this.finalPosition=[17,10,20];
          this.finalTarget=[12,0,5];
        }
      }

    this.currTime=0;
    this.done = true;

    this.currXPosition;
    this.currYPosition;
    this.currZPosition;
  
    this.currXTarget;
    this.currYTarget;
    this.currZTarget;
  
    this.vetorTarget=[this.finalTarget[0]-this.initialTarget[0],this.finalTarget[1]-this.initialTarget[1],this.finalTarget[2]-this.initialTarget[2]];
    this.vetorPosition=[this.finalPosition[0]-this.initialPosition[0],this.finalPosition[1]-this.initialPosition[1],this.finalPosition[2]-this.initialPosition[2]];
  };
  
  /**
  * Update the animation of the camera.
  * @param {number} deltaTime time since last update
  */
 updateAnimation(deltaTime){
  
    this.currTime += deltaTime;
  
    if (this.currTime >= this.span) {
        this.scene.camera.setPosition(vec3.fromValues(this.finalPosition[0],this.finalPosition[1],this.finalPosition[2]));
        this.scene.camera.setTarget(vec3.fromValues(this.finalTarget[0],this.finalTarget[1],this.finalTarget[2]));
        this.done=true;
        return;

    } else {
  
        var percentage = this.currTime / this.span;
  
        this.currXPosition=this.initialPosition[0]+percentage*this.vetorPosition[0];
        this.currYPosition=this.initialPosition[1]+percentage*this.vetorPosition[1];
        this.currZPosition=this.initialPosition[2]+percentage*this.vetorPosition[2];
  
        this.currXTarget=this.initialTarget[0]+percentage*this.vetorTarget[0];
        this.currYTarget=this.initialTarget[1]+percentage*this.vetorTarget[1];
        this.currZTarget=this.initialTarget[2]+percentage*this.vetorTarget[2];
  
  
        this.scene.camera.setPosition(vec3.fromValues(this.currXPosition,this.currYPosition,this.currZPosition));
        this.scene.camera.setTarget(vec3.fromValues(this.currXTarget,this.currYTarget,this.currZTarget));
    }
  };
}