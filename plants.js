// This is where all plants including crops will work

import {plantData} from './plantsData.js';

export class Plant {
    constructor(scene, tileX, tileY, type, worldManager){
        this.scene = scene;
        this.tileX = tileX; // Grid position x
        this.tileY = tileY; // Grid position y
        this.type = type; // Checking what type of plant it is
        this.worldManager = worldManager; // Taking data from worldmanager to understand weather conditions

        console.log(this);

        this.worldX = tileX * 16; // World position x
        this.worldY = tileY * 16; // World position y

        // console.log(plantData[this.type]); Test to see what type was selected

        this.spriteSheet = plantData[this.type].spriteSheet; // Accessing spritesheet for sepecifc plant sizes
        this.startFrame = plantData[this.type].startFrame; // What plant it'll be from the spritesheet
        this.currentFrame = this.startFrame; // When changing frames to the next it'll start from the initial point

        this.currentStage = 1; // The growth stage
        this.maxStages = plantData[this.type].maxStage; // Depending on the plants

        this.growthTimer = 0; // Timer that it'll use to grow real time

        console.log("WorldManager:", this.worldManager);
        console.log("realTime property:", this.worldManager?.realTime);

        if (this.worldManager?.realTime) this.nextStageTimer = plantData[this.type].nextStageTimer * 100; // If using real world time, make crops take longer to grow
        else this.nextStageTimer = plantData[this.type].nextStageTimer; // The timer set in plants data for the specific type
        
        this.fullyGrown = false; // Only started growing so no

        this.harvestable = false; // Default as plant has only started growing

        this.sprite = scene.add.sprite(
            this.worldX + 8, // Center x wise
            this.worldY + 16, // Yenter y wise
            this.spriteSheet, // Spritesheet used (i.e. small, medium, large plants)
            this.startFrame   // Starting frame / plant stage
        );

        this.sprite.setOrigin(0.5, 1); // Sets the origin to the bottom-middle of the tile.
        this.sprite.setDepth(this.sprite.y); // Ensures that the depth of the sprite is where its placed,
        // wont have an issue if placed behind or in front of another, all of them will be seen.
    }

    // grow will be called to increase the growth cycle of the plant, changing its frame and eventually making it harvestable
    grow(){
        this.currentStage += 1;
        this.currentFrame += 1;

        // Changing its frame
        this.sprite.setTexture(plantData[this.type].spriteSheet, this.currentFrame);

        if (this.currentStage >= this.maxStages){
            // stop update or grow so its not contantly running in the background as the plant is fully grown? 
            this.fullyGrown = true;
            this.harvestable = true;
        }
    }

    // Ensuring factors are updating, especially the growth in this case
    update(time, delta){
        // delta = time passed since last frame (in milliseconds) not FPS
        this.growthTimer += delta;

        if (this.fullyGrown == false){
            // Multiplied by growthModifier to see whether its slowed down or sped up due to weather conditions.
            if (this.growthTimer * this.worldManager.growthModifier >= this.nextStageTimer){ // seconds for now but in real game might be maybe even minutes
                this.grow();
                this.growthTimer = 0;
            }
        }
    }
}