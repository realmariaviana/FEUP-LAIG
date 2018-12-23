class MyTab extends CGFobject{

	constructor(scene){
        super(scene);
        this.tab = new MyPlane(this.scene,50,50);
        this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.4,0.4,0.4,1);
        this.appearance.loadTexture("../scenes/images/tabuleiro.png");
        this.default=new CGFappearance(this.scene);

        this.pieces=[];
        
        for(let i=0;i<10;i++){
            let line = [];
            for(let k=0;k<10;k++){
                line.push(this.tab);
            }
            this.scene.objects.push(line);   
        }
       
    }


    display(){
        this.scene.pushMatrix();
        this.scene.scale(10.6,1,10.6);
        this.appearance.apply();
        this.tab.display();
        this.scene.popMatrix();

    }

    

};