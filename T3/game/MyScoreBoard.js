/**
 * MyScoreBoard
 * @constructor
 */
class MyScoreBoard extends CGFobject
{
	/**
	* Creates the scoreboard.
	* @param scene Scene to draw the score board on.
	*/
	constructor(scene)
	{
        super(scene);
        this.lastUpdateTime = 0;
        this.initElements();
	};

	/**
	/Initializes score board parts
	*/
	initElements(){

        this.font = new MyLedFont(this.scene);
	    this.quad=new MyQuad(this.scene, 0, 0, 1, 1);

	    this.grayMaterial = new CGFappearance(this.scene);
        this.grayMaterial.setDiffuse(0.2,0.2,0.2,1);
        this.grayMaterial.setSpecular(0.2,0.2,0.2,1);
        this.grayMaterial.setAmbient(0.2,0.2,0.2,1);

	    this.boardMaterial = new CGFappearance(this.scene);
	    this.boardMaterial.setAmbient(0.8,0.8,0.8,1);
	    this.boardMaterial.setDiffuse(0.8,0.8,0.8,1);
	    this.boardMaterial.setSpecular(0.8,0.8,0.8,1);
        this.boardMaterial.loadTexture("../scenes/images/scoreboard.jpg");
    }
    

	/**
     * Displays the board.
     */
	display(){

        var pointDigits = [['-','1'],['-','1']];
        if(this.points[0] >= 0){
            pointDigits[0][0] = String(Math.floor(this.points[0]/10));
            pointDigits[0][1] = String(this.points[0] % 10);
        }
        if(this.points[1] >= 0){
            pointDigits[1][0] = String(Math.floor(this.points[1]/10));
            pointDigits[1][1] = String(this.points[1] % 10);
        }

        var timeDigits = ['-','-'];
	    if(this.scene.game.timer >= 0){
		timeDigits[0] = String(Math.floor(this.scene.game.timer/10));
		timeDigits[1] = String(this.scene.game.timer % 10);
	    }

        this.scene.setActiveShader(this.font.shader);
        this.scene.pushMatrix();

        this.scene.translate(1.8, 0, 0);

        this.scene.pushMatrix();
			this.scene.scale(0.5, 0.7, 1);
			this.scene.pushMatrix();
				this.scene.translate(5.5, 3.7, 0.35);
				this.font.displayWithLetter(timeDigits[0], this.quad);
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(7.5, 3.7, 0.35);
				this.font.displayWithLetter(timeDigits[1], this.quad);
			this.scene.popMatrix();
		this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.scale(0.6, 0.8, 1);
                this.scene.translate(2, -1.4, 0);
                this.scene.pushMatrix();
                    this.scene.translate(-1, 2, 0.35);
                    this.font.displayWithLetter(pointDigits[0][0], this.quad);
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(1, 2, 0.35);
                    this.font.displayWithLetter(pointDigits[0][1], this.quad);
                this.scene.popMatrix();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.scale(0.6, 0.8, 1);
                this.scene.translate(8.5, -1.4, 0);
                this.scene.pushMatrix();
                    this.scene.translate(-1, 2, 0.35);
                    this.font.displayWithLetter(pointDigits[1][0], this.quad);
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(1, 2, 0.35);
                    this.font.displayWithLetter(pointDigits[1][1], this.quad);
                this.scene.popMatrix();
            this.scene.popMatrix();

            this.scene.setActiveShader(this.scene.defaultShader);
            this.scene.scale(3.5, 2.7, 0.4);

            this.scene.pushMatrix();
                this.scene.translate(0, 0, 0.6);
                this.scene.scale(2, 1.5, 1);
                this.boardMaterial.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.grayMaterial.apply();
            
        this.scene.popMatrix();
    };
    
    update(deltaTime){
        let newTime = this.scene.game.timer-deltaTime;
        
        if(newTime<=0){

            this.resetTimer();
            this.scene.game.changePlayerTurn();
        }
        else this.scene.game.timer = newTime;

    }

    resetTimer(){
        this.scene.game.timer=this.scene.interface.gui.playTime;
    }

};
