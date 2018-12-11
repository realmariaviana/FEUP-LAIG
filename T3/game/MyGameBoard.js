/**
 * MyGameBoard
 * @constructor
 */
class MyGameBoard extends CGFobject
{
	/**
	* Creates the scoreboard.
	* @param scene Scene to draw the score board on.
	*/
	constructor(scene)
	{
		super(scene);
		this.initElements();
	};

	/**
	/Initializes score board parts
	*/
	initElements(){
        this.scoreboard = new MyScoreBoard(this.scene);
	}

	/**
     * Displays the board.
     */
	display(){
		this.scoreboard.points=[12,25];
		this.scene.pushMatrix();

		this.scene.translate(-0.1,3,11.5);
		this.scene.rotate(-Math.PI,0,1,0);
		this.scene.rotate(-Math.PI/2,0,1,0);
		this.scoreboard.display();
		this.scene.popMatrix();

	};

	updateTextCoords(length_s, length_t){
	};

};
