// This is where all plants including crops will work

// Will finish it hopefully when i get back
export class Plant {
    constructor(scene, tileX, tileY, type){
        this.scene = scene;
        this.tileX = tileX; // grid position x
        this.tileY = tileY; // grid position y
        this.type = type; // checking what type of plant it is

        this.worldX = tileX * 16; // world position x
        this.worldY = tileY * 16; // world position y

        if (type == "plant"){
            this.startFrame = 568; // ID on the spritesheet (using tiled)
            this.maxStages = 4;

            this.sprite = scene.add.sprite(
                this.worldX + 8, // center x wise
                this.worldY + 16, // center y wise
                "smallPlant",
                this.startFrame   // starting frame / plant stage
            );
        }

        this.sprite.setOrigin(0.5, 1); // bottom middle of image

        this.startFrame; // What plant it'll be from the spritesheet
        this.currentStage = 0; // The growth stage
        this.growthTimer = 0; // Timer that it'll use to grow real time
        this.maxStages; // Depending on the plants
        this.fullyGrown = false; // Only started growing so no

        // this.growthSpeed = 5000; // 5 seconds for an example
        // this.growthModifier = 1; // how it affects the growth speed

        // example if (growthTimer >= growthSpeed * growthModifer)
        // modifier will change depending on the weather for example
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
            this.sprite = "";
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