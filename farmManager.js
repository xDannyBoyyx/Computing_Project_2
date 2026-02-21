export class FarmManager {

    
    constructor(scene, map) {
        this.scene = scene;   
        this.map = map;       

        this.tileSize = 16;   // each tile is 16x16 pixels

        // Object that stores ALL farming data for each tile
        // Example key: "3,5" → tile at x=3, y=5
        this.tiles = {}; 

        

        // Sets up keyboard and mouse interaction
        this.setupInput();

    }


    setupInput() {
        // Mouse input
        this.scene.input.on('pointerdown', (pointer) => {
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
            const tile = this.worldToTileXY(worldPoint.x, worldPoint.y);

            if (pointer.leftButtonDown()) {
                this.handleFarmAction(tile.x, tile.y, "primary");
            }

            if (pointer.rightButtonDown()) {
                this.handleFarmAction(tile.x, tile.y, "secondary");
            }
        });

        // Keyboard input 
        this.interactKey = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );

        
    }

     // can now call this inside game.js
    update(player) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            const tile = this.worldToTileXY(player.sprite.x, player.sprite.y);
            this.handleFarmAction(tile.x, tile.y, "primary");
        }
    }


     // 
    worldToTileXY(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.tileSize),
            y: Math.floor(worldY / this.tileSize)
        };
    }

    // --- Farming logic ---
    handleFarmAction(x, y, type) {
        const tile = this.getTile(x, y);
        const hotbar = this.scene.hotbar;
        const tool = hotbar.getSelectedTool();
        // Hoe must be highlighted in order for you to till soil
        if (type === "primary") {
            // Tilling
            if ( tool === 'Hoe' && !tile.tilled) {
                this.till(x, y);
            
            } 
            else if ( tile.tilled && !tile.crop) {
                this.plant(x, y, "wheat");

            }
            else if (tool === 'WateringCan' && tile.tilled) {
                // Unsure whether it would be better to equip it in order to use, or just have it in the hotbar and you can right click. (potential QOL change?)
                this.water(x, y);
            } 
            else {
                console.log("Harvest not implemented yet");
            }
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

            console.log("Tile tilled:", x, y);
        }
    }

    // Water a tile
    water(x, y) {
        const tile = this.getTile(x, y);

        // Can only water tilled soil
        if (tile.tilled) {
            tile.watered = true;

            // Darkens the soil colour to show it's wet
            if (tile.visual) {
                tile.visual.setFillStyle(0x4e342e);
            }

            console.log("Watered:", x, y);
        }
    }

    // Plant a crop on a tile
    plant(x, y, plantType = "crop") {
        // changed to plantType as it makes sense instead of only planting just "wheat". ^^
        const tile = this.getTile(x, y);

        // Only plant if:
        // - tile is tilled
        // - there is no crop already there
        if (tile.tilled && !tile.crop) {

            // Create a crop object to track its growth
            tile.crop = {
                type: plantType, // what crop it is (wheat, corn, etc)
                growth: 0,      // how much it has grown so far
                stage: 0        // which sprite stage it is at
            };

            console.log("Planted", plantType, "at", x, y);
        }
    }

  

 
}

