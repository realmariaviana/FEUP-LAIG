/**
 * MyLedFont
 * @constructor
 */
class MyLedFont extends CGFobject
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

        this.shader = new CGFshader(this.scene.gl, 'font/shaders/font.vert', 'font/shaders/font.frag');
        this.shader.setUniformsValues({'dims': [10, 6]});
          this.appearance = new CGFappearance(this.scene);
          this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
          this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
          this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
          this.appearance.setShininess(120);
          this.texture = new CGFtexture(this.scene, '../../scenes/images/font.jpg');
          this.appearance.setTexture(this.texture);
      
          this.backgroundAppearance =  new CGFappearance(this.scene);
          this.backgroundAppearance.setAmbient(0, 0, 0, 1);
          this.backgroundAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
          this.backgroundAppearance.setSpecular(0.0, 0.0, 0.0, 1);
          this.backgroundAppearance.setShininess(120);
    }
    
    getCharPos(char){
            var code = char.toLowerCase().charCodeAt(0);
        if(code >= 'a'.charCodeAt(0) && code <= 'j'.charCodeAt(0))
        return [code-'a'.charCodeAt(0),0];
        else if(code >= 'k'.charCodeAt(0) && code <= 't'.charCodeAt(0))
        return [code-'k'.charCodeAt(0),1];
        else if(code >= 'u'.charCodeAt(0) && code <= 'z'.charCodeAt(0))
        return [code-'u'.charCodeAt(0),2];
        else if (code >= '0'.charCodeAt(0) && '9'.charCodeAt(0)){
            return [code-'0'.charCodeAt(0), 5];
        } else {
            switch(char) {
        case '.':
            return [0, 3];
        case '?':
                return [1, 3];
        case '!':
            return [2, 3];
        case '(':
                return [3, 3];
            case ')':
                return [4, 3];
        case '-':
        return [1, 4];
        case ' ':
        return [3,6];
            default:
                return [3, 6];
            }
        }
    }

	/**
     * Displays the letter.
     */
	displayWithLetter(letter,obj){
        var coords = this.getCharPos(letter);
        this.shader.setUniformsValues({'charCoords': coords});
        this.appearance.apply();
        obj.display();
	};

	updateTextCoords(length_s, length_t){
	};

};
