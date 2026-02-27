import { Plant } from "./plants.js";

export class FarmManager {
    constructor(scene, map) {
        this.scene = scene;   
        this.map = map;       

        this.tileSize = 16;   // each tile is 16x16 pixels

        // Object that stores ALL farming data for each tile
        // Example key: "3,5" → tile at x=3, y=5
        this.tiles = {}; 

        // Stores the plants that are created when planting on the tile
        // Done so that they can be accessed outside the plant function and update for example can be called
        this.plantsArr = [];

        // Sets up keyboard and mouse interaction
        this.setupInput();
    }

    setupInput() {
        // Mouse input
        this.scene.input.on('pointerdown', (pointer) => {
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
            const tile = this.worldToTileXY(worldPoint.x, worldPoint.y);

            if (pointer.leftButtonDown()) {
                this.handleFarmAction(tile.x, tile.y);
            }
            // got rid of the third parameter since it'll only be using left click -D

            // if (pointer.rightButtonDown()) {
            //     this.handleFarmAction(tile.x, tile.y, "secondary");
            // }

            // i reckon using left click for everything will be easier -D
        });

        // Keyboard input 
        this.interactKey = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );        
    }

     // can now call this inside game.js
    update(player, time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            const tile = this.worldToTileXY(player.sprite.x, player.sprite.y);
            this.handleFarmAction(tile.x, tile.y, "primary");
        }

        // For each plant inside the plant array, update them to ensure they can grow
        // Will be updated to ensure that they check certain parameters like it being watered
        // or certain weather conditions for example -D
        for (var p of this.plantsArr){
            p.update(time,delta);
        }
    }

    worldToTileXY(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.tileSize),
            y: Math.floor(worldY / this.tileSize)
        };
    }

    // --- Farming logic ---
        handleFarmAction(x, y) {
            if (this.scene.isUIOpen) return;

            const tile = this.getTile(x, y);
            const hotbar = this.scene.hotbar;
            const tool = hotbar.getSelectedTool();

            // Gets the tool type 
            const toolType = tool?.type ?? null;

            if (toolType === 'Hoe' && !tile.tilled) {
                this.till(x, y);
            } 
            else if (tile.tilled && !tile.plant && !toolType) { 
                // eventually check for seeds instead of empty handed
                this.plant(x, y, "plant");
            }
            else if (toolType === 'WateringCan' && tile.tilled) {
                this.water(x, y);
            }
            else {
                console.log("Harvest not implemented yet");
            }
        }

    // Convert x + y into a unique string key like "2,4"
    // This lets us store tile data in the object easily
    getKey(x, y) {
        return `${x},${y}`;
    }

    // Get the data for a tile at (x, y)
    // If it doesn't exist yet, create a fresh default tile
    getTile(x, y) {
        const key = this.getKey(x, y);

        // If we have never interacted with this tile before
        if (!this.tiles[key]) {
            // Create default tile state
            this.tiles[key] = {
                tilled: false,     // has the player tilled the soil?
                watered: false,    // has the tile been watered?
                crop: null,        // what crop is planted here (if any)
                depth: y,
                fertility: 1.0     // how healthy the soil is (1 = normal, will expand later)
            };
        }

        return this.tiles[key];
    }

    // Turn a normal tile into tilled soil
    till(x, y) {
        const tile = this.getTile(x, y);

        // Only till if it hasn't already been tilled
        if (!tile.tilled) {
            tile.tilled = true;

            // --- VISUAL PLACEHOLDER ---
            // We don't have many assets yet, so I'll draw a brown square for now
            // This shows the player the tile is tilled

            const worldX = x * this.tileSize;
            const worldY = y * this.tileSize;

            const rect = this.scene.add.rectangle(
                worldX + 8,  // center of tile
                worldY + 8,
                16,          // width
                16,          // height
                0x6b4f2a     // brown colour
            );

            // Save reference so we can change it later (watering, crops, etc.)
            tile.visual = rect;

            console.log("Tile tilled:", x, y); // to check if its working
        }
    }

    // Water a tile
    water(x, y) {
        const tile = this.getTile(x, y);

        // Can only water tilled soil
        if (tile.tilled) {
            tile.watered = true;
            console.log(tile);

            // Darkens the soil colour to show it's wet
            if (tile.visual) {
                tile.visual.setFillStyle(0x4e342e);
            }

            console.log("Watered:", x, y);
        }
    }

    // Plant a crop on a tile
    plant(x, y, plantType) {
        const tile = this.getTile(x, y);

        // Only plant if:
        // - tile is tilled
        // - tile is watered
        // - there is no crop already there
        if (tile.tilled && !tile.plant) {
            // Create a crop object to track its growth
            tile.plant = new Plant(this.scene, x, y, plantType);

            this.plantsArr.push(tile.plant); // To access plants outside the function

            // console.log("Planted", plantType, "at", x, y);
        }
    }
}

