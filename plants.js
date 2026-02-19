// This is where all plants including crops will work

// Will finish it hopefully when i get back
export class Plants {
    constructor(scene, tileX, tileY){
        this.scene = scene;
        this.tileX = tileX; // grid position x
        this.tileY = tileY; // grid position y
        this.worldX = tileX * 16; // world position x
        this.worldY = tileY * 16; // world position x
        // this.sprite = "image"; // for now not in use as i dont have image

        // Temporary as i dont have image
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xb6eabc); // Red fill
        graphics.fillRect(0, 0, 100, 100); // Draw a 100x100 rectangle   
        graphics.generateTexture('rectangleTexture', 100, 100);

        this.sprite = (this.worldX, this.worldY, 'rectangleTexture'); 
        this.scene.sprite.setOrigin(0.5, 1);

        this.currentStage = 0;
        this.growthTimer = 0;
        this.maxStages = 4; // not sure so 4 for now
        this.fullyGrown = false;
    }

    update(time, delta){

        // delta = time passed since last frame (in milliseconds) not FPS
        this.growthTimer += delta;

        if (this.fullyGrown == false){
            if (this.growthTimer >= 3000){ // 3 seconds for now but in real game might be maybe even minutes
                this.grow();
                this.growthTimer = 0;
            }
        }
    }

    grow(){
        this.currentStage += 1;

        if (this.currentStage >= this.maxStages){
            // this.sprite = "current_frame + 1"; //unsure as i still dont have image

            graphics.fillStyle(0x2ca438);

        } else {
            // stop update or grow so its not contantly running in the background as the plant is fully grown?
            this.fullyGrown = true;
        }
    }

    reactToWeather(weather){

        // could slow down growthtimer or some other feature for example?
        switch (weather){
            case "rain":

            break;
            case "dry":

            break
            case "hot":

            break;
            case "snow":

            break;
            case "cold":

            break;
            case "windy":

            break;

            default:
                //keep natural weather
        }
    }
}