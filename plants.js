// This is where all plants including crops will work

import {plantData} from './plantsData.js';
// import {WorldManager} from './worldManager.js';

export class Plant {
    constructor(scene, tileX, tileY, type, worldManager){
        this.scene = scene;
        this.tileX = tileX; // grid position x
        this.tileY = tileY; // grid position y
        this.type = type; // checking what type of plant it is
        this.worldManager = worldManager;

        this.worldX = tileX * 16; // world position x
        this.worldY = tileY * 16; // world position y

        // console.log(plantData[this.type]); test to see what type was selected

        this.spriteSheet = plantData[this.type].spriteSheet; // accessing spritesheet for sepecifc plant sizes
        this.startFrame = plantData[this.type].startFrame; // What plant it'll be from the spritesheet
        this.currentFrame = this.startFrame; // When changing frames to the next it'll start from the initial point

        this.currentStage = 1; // The growth stage
        this.maxStages = plantData[this.type].maxStage; // Depending on the plants

        this.growthTimer = 0; // Timer that it'll use to grow real time
        this.nextStageTimer = plantData[this.type].nextStageTimer;
        this.fullyGrown = false; // Only started growing so no

        this.growthModifier = 1; // how it affects the growth speed

        this.harvestable = false;

        // example if (growthTimer >= growthSpeed * growthModifer)
        // modifier will change depending on the weather for example

        this.sprite = scene.add.sprite(
            this.worldX + 8, // center x wise
            this.worldY + 16, // center y wise
            this.spriteSheet,
            this.startFrame   // starting frame / plant stage
        );

        this.sprite.setOrigin(0.5, 1); // Sets the origin to the bottom-middle of the tile.
        this.sprite.setDepth(this.sprite.y); // Ensures that the depth of the sprite is where its placed,
        // wont have an issue if placed behind or in front of another, all of them will be seen.
    }

    grow(){
        this.currentStage += 1;
        this.currentFrame += 1;

        this.sprite.setTexture(plantData[this.type].spriteSheet, this.currentFrame);

        if (this.currentStage >= this.maxStages){
            // stop update or grow so its not contantly running in the background as the plant is fully grown? 
            this.fullyGrown = true;
            this.harvestable = true;
        }
    }

    // might use a data table similar to plantData.js for the different factors like humidity, temperature, wind, etc.
    reactToWeather(){
        if (this.worldManager.realWeather){
            if (this.worldManager.temperature < 15 || this.worldManager.temperature > 25){
                this.growthModifier = 1.4; // Making it take slightly longer for plants to grow because of temperatures
            } else { 
                this.growthModifier = 1.0;
            }

            // check the certain api names for rain and snow.
        } else {
            // Checking in game weathers and changing the growth modifiers based on what the random weather chosen was.
            switch (this.worldManager.currentWeather){
                case "sunny":
                    this.growthModifier = 0.8
                break;
                case "cloudy":
                    this.growthModifier = 1.1;
                break
                case "windy":
                    this.growthModifier = 1.2
                break;
                case "rain":
                    this.growthModifier = 1.1;
                    // watered tile
                break;
                case "snow":
                    this.growthModifier = 1.3;
                    // watered tile
                break;
                case "storm":
                    this.growthModifier = 1.5;
                    // watered tile
                break;
                case "dry heat":
                    this.growthModifier = 1.8;
                    // dry any watered tiles
                break;
                case "blizzard":
                    this.growthModifier = 2.0;
                    // watered tile
                break;

                default:
                    this.growthModifier = 1.0;
            }
        }
    }

    update(time, delta){
        // delta = time passed since last frame (in milliseconds) not FPS
        this.growthTimer += delta;

        if (this.fullyGrown == false){
            this.reactToWeather(); // constantly reacting to the weather depending on what it is

            // Multiplied by growthModifier to see whether its slowed down or sped up due to weather conditions.
            if (this.growthTimer * this.growthModifier >= this.nextStageTimer){ // seconds for now but in real game might be maybe even minutes
                this.grow();
                this.growthTimer = 0;
            }
        }
    }
}