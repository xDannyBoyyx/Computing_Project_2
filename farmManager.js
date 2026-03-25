import { Plant } from "./plants.js";
import { plantData } from './plantsData.js';

const pouchToPlant = {
    'wheatPouch': 'wheat',
    'carrotPouch': 'carrot',
    'raddishPouch': 'raddish',
    'cabbagePouch': 'cabbage'
};

export class FarmManager {
    constructor(scene, map, worldManager) {
        this.scene = scene;   
        this.map = map;    
        this.worldManager = worldManager;

        this.tileSize = 16;   // each tile is 16x16 pixels

        // Object that stores ALL farming data for each tile
        // Example key: "3,5" → tile at x=3, y=5
        this.tiles = {}; 

        // Stores the plants that are created when planting on the tile
        // Done so that they can be accessed outside the plant function and update for example can be called
        this.plantsArr = [];

        this.tooltipActive = false;
        this.lastTooltipTile = null;

        // Create tile highlight
        this.createTileHighlight();
        
        // CREATE PLANT TOOLTIP
        this.createPlantTooltip();

        // Sets up keyboard and mouse interaction
        this.setupInput();
    }

    // ----------------------------------------------------------- UI ---------------------------------------------------------------------------

    createTileHighlight() {
        // Create a rectangle that highlights the tile under cursor
        this.tileHighlight = this.scene.add.rectangle(0, 0, this.tileSize, this.tileSize)
            .setStrokeStyle(2, 0xffffff, 0.8)
            .setFillStyle(0xffffff, 0.2)
            .setDepth(100)
            .setScrollFactor(1, 1)
            .setVisible(false);
    }

    createPlantTooltip() {
        // Background panel
        this.tooltipBg = this.scene.add.rectangle(0, 0, 150, 60, 0x000000, 0.8)
            .setOrigin(0, 1)
            .setDepth(900)
            .setScrollFactor(0)
            .setVisible(false);
        
        // Plant name text
        this.tooltipName = this.scene.add.text(0, 0, '', {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        })
            .setOrigin(0, 1)
            .setDepth(901)
            .setScrollFactor(0)
            .setVisible(false);
        
        // Growth stage text
        this.tooltipStage = this.scene.add.text(0, 0, '', {
            fontSize: '10px',
            color: '#aaaaaa'
        })
            .setOrigin(0, 1)
            .setDepth(902)
            .setScrollFactor(0)
            .setVisible(false);
        
        // Time remaining text
        this.tooltipTime = this.scene.add.text(0, 0, '', {
            fontSize: '10px',
            color: '#ffff00'
        })
            .setOrigin(0, 1)
            .setDepth(902)
            .setScrollFactor(0)
            .setVisible(false);
    }

    setupInput() {
        // Mouse input
        this.scene.input.on('pointerdown', (pointer) => {
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
            const tile = this.worldToTileXY(worldPoint.x, worldPoint.y);

            if (pointer.leftButtonDown()) {
                this.handleFarmAction(tile.x, tile.y);
            }
        });

        // Mouse move to update highlight and tooltip
        this.scene.input.on('pointermove', (pointer) => {
            this.updateTileHighlight(pointer);
            this.updatePlantTooltip(pointer);
        });

        // Keyboard input 
        this.interactKey = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );        
    }

    updateTileHighlight(pointer) {
        // Don't show highlight if UI is open
        if (this.scene.isUIOpen) {
            this.tileHighlight.setVisible(false);
            return;
        }

        // Declare hotbar and toolType once at the top
        const hotbar = this.scene.hotbar;
        const tool = hotbar.getSelectedTool();
        const toolType = tool?.type ?? null;
        
        // Don't show highlight if no tool is selected
        if (!toolType) {
            this.tileHighlight.setVisible(false);
            return;
        }

        // USE THE SAME METHOD AS CLICKING
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tile = this.worldToTileXY(worldPoint.x, worldPoint.y);
        
        // Position highlight at tile center (in world coordinates)
        const worldX = tile.x * this.tileSize + this.tileSize / 2;
        const worldY = tile.y * this.tileSize + this.tileSize / 2;
        
        this.tileHighlight.setPosition(worldX, worldY);
        this.tileHighlight.setVisible(true);

        // Change color based on what action is available
        const tileData = this.getTile(tile.x, tile.y);

        let color = 0xff0000; // Red = no action
        let alpha = 0.2;

        // Check what action can be performed
        if (toolType === 'Hoe' && !tileData.tilled) {
            color = 0x8b4513; // Brown = can till
            alpha = 0.3;
        } 
        else if (pouchToPlant[toolType] && tileData.tilled && !tileData.plant) {
            color = 0x00ff00; // Green = can plant
            alpha = 0.3;
        }
        else if (toolType === 'WateringCan' && tileData.tilled && !tileData.watered) {
            color = 0x00bfff; // Blue = can water
            alpha = 0.3;
        }
        else if (toolType === 'Scythe' && tileData.plant && tileData.plant.harvestable) {
            color = 0xffff00; // Yellow = can harvest
            alpha = 0.4;
        }

        this.tileHighlight.setFillStyle(color, alpha);
        this.tileHighlight.setStrokeStyle(2, color, 0.8);
    }

    updatePlantTooltip(pointer) {
        // Don't show if UI is open
        if (this.scene.isUIOpen) {
            this.hideTooltip();
            return;
        }

        // Get tile under cursor
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tile = this.worldToTileXY(worldPoint.x, worldPoint.y);
        const tileData = this.getTile(tile.x, tile.y);

        // Check if there's a plant on this tile
        if (!tileData.plant) {
            this.hideTooltip();
            return;
        }

        // Store which tile we're hovering over
        this.tooltipActive = true;
        this.lastTooltipTile = { x: tile.x, y: tile.y };

        const plant = tileData.plant;
        const plantName = plant.type.charAt(0).toUpperCase() + plant.type.slice(1);
        
        const data = plantData[plant.type];
        
        let timeText = '';
        if (plant.harvestable) {
            timeText = 'Ready to harvest!';
        } else {
            const timeLeft = plant.nextStageTimer - plant.growthTimer;
            const secondsLeft = Math.ceil(timeLeft / 1000);
            timeText = `${secondsLeft}s until next stage`;
        }
        
        const stageText = `Stage ${plant.currentStage}/${plant.maxStages}`;
        
        const tooltipX = pointer.x + 15;
        const tooltipY = pointer.y - 10;
        
        this.tooltipName.setText(plantName);
        this.tooltipStage.setText(stageText);
        this.tooltipTime.setText(timeText);
        
        const maxWidth = Math.max(
            this.tooltipName.width,
            this.tooltipStage.width,
            this.tooltipTime.width
        );
        this.tooltipBg.setSize(maxWidth + 35, 65);
        
        this.tooltipBg.setPosition(tooltipX, tooltipY);
        
        this.tooltipName.setPosition(tooltipX + 5, tooltipY - 45);
        this.tooltipStage.setPosition(tooltipX + 5, tooltipY - 28);
        this.tooltipTime.setPosition(tooltipX + 5, tooltipY - 10);
        
        this.tooltipBg.setVisible(true);
        this.tooltipName.setVisible(true);
        this.tooltipStage.setVisible(true);
        this.tooltipTime.setVisible(true);
    }

    hideTooltip() {
        this.tooltipActive = false;
        this.lastTooltipTile = null;
        this.tooltipBg.setVisible(false);
        this.tooltipName.setVisible(false);
        this.tooltipStage.setVisible(false);
        this.tooltipTime.setVisible(false);
    }

    // ----------------------------------------------------------- UI ---------------------------------------------------------------------------

    worldToTileXY(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.tileSize),
            y: Math.floor(worldY / this.tileSize)
        };
    }

    // Farming logic
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
        //check if its a pouch
        else if (pouchToPlant[toolType] && tile.tilled && !tile.plant) {
            // Use one seed from the pouch
            const canPlant = hotbar.useSeed(hotbar.selectedSlot);
            
            if (canPlant) {
                const plantType = pouchToPlant[toolType];
                this.plant(x, y, plantType);
                console.log(`Planted ${plantType} from ${toolType}`);
            }
        }
        else if (toolType === 'WateringCan' && tile.tilled) {
            this.water(x, y);
        }
        else if (toolType === 'Scythe' && tile.plant && tile.plant.harvestable) {
            this.tryHarvest(this.scene.player);
        }

        else {
            console.log("Harvest not implemented yet");
        }
    }

    // change so it shows last part of spritesheet.
    tryHarvest(player) {
        const hotbar = this.scene.hotbar;
        const selectedTool = hotbar.getSelectedTool();

        // Only harvest if the player has the Scythe
        if (!selectedTool || selectedTool.type !== 'Scythe') return;

        // Find only one harvestable plant within range
        let targetPlant = null;
        for (let plant of this.plantsArr) {
            const dist = Phaser.Math.Distance.Between(
                player.sprite.x, player.sprite.y,
                plant.sprite.x, plant.sprite.y
            );

            if (dist < 64 && plant.harvestable) {
                targetPlant = plant;
                break; 
            }
        }

        if (!targetPlant) return;

        // Add harvested plant to inventory
        const inventory = this.scene.inventory;
        const emptyIndex = inventory.items.findIndex(i => !i);

        if (emptyIndex === -1) return; //  if inv is full

        const slot = inventory.slots[emptyIndex];
        const plantInfo = plantData[targetPlant.type];

        const itemSprite = this.scene.add.sprite(slot.x, slot.y, plantInfo.spriteSheet, targetPlant.currentFrame)
            .setDisplaySize(21, 21)
            .setInteractive(new Phaser.Geom.Rectangle(-21, -21, 60, 60), Phaser.Geom.Rectangle.Contains);

        this.scene.input.setDraggable(itemSprite);
        itemSprite.source = 'inventory';
        itemSprite.slotIndex = emptyIndex;
        itemSprite.harvestedFrame = targetPlant.currentFrame;

        inventory.container.add(itemSprite);

        inventory.items[emptyIndex] = {
            type: targetPlant.type,
            sprite: itemSprite,
            frame: targetPlant.currentFrame,
            harvestedFrame: targetPlant.currentFrame,
            price: plantInfo.sellValue,
            displaySize: 21,
            source: 'inventory',
            slotIndex: emptyIndex
        };

        // Spoke about this already but i reckon it shouldn't completely remove the plant when harvesting as then it can just grow again
        // Should only remove the plant if the user decides to use the Hoe for example on it again. -D

        // Remove the plant
        targetPlant.sprite.destroy();
        this.plantsArr = this.plantsArr.filter(p => p !== targetPlant);

        const tileData = this.getTile(targetPlant.tileX, targetPlant.tileY);

        if (tileData) {
            tileData.plant = null;
            tileData.watered = false;

            // Replace tile with dry tilled soil
            this.map.putTileAt(77, targetPlant.tileX, targetPlant.tileY);

            // Get the new tile reference
            tileData.visual = this.map.getTileAt(targetPlant.tileX, targetPlant.tileY);

            // Clears the tint so it looks dry again
            if (tileData.visual) {
                tileData.visual.tint = 0xffffff; 
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

            // using the tileset and simply changing tiles instead
            // might be out of scope but will want to implement a neighbor check
            // this will ensure that the tilled tile doesn't look out of the blue and bends in
            // could have greener sides as long as the neighbors aren't tilled as well.
            const rect = this.map.putTileAt(77, // key
                                            x, // x 
                                            y); // y

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

            // Darkens the soil colour to show it's wet
            if (tile.visual) {
                tile.visual.tint = 0xB8C0D0; // Changing the tint to make it slightly darker / wet
            } else {
                tile.visual.tint = 0xffffff; // Reseting it back to normal look
            }

            console.log(`Watered soil at ${x} & ${y}`); // Just ensuring its watered the right tile
        }
    }

    // Plant a crop on a tile
    plant(x, y, plantType) {
        const tile = this.getTile(x, y);

        // Only plant if:
        // - tile is tilled
        // - there is no crop already there
        if (tile.tilled && !tile.plant) {
            tile.plant = new Plant(this.scene, x, y, plantType, this.worldManager); // Creating a new plant
            console.log(`Planted ${plantType} at ${x} & ${y}`); // Checking where its been planted
            this.plantsArr.push(tile.plant); // To access plants outside the function
        }
    }
    

    update(player, time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            const tile = this.worldToTileXY(player.sprite.x, player.sprite.y);
            this.handleFarmAction(tile.x, tile.y, "primary");
        }

        // For each plant inside the plant array, update them to ensure they can grow after being watered
        for (var p of this.plantsArr){
            if (this.getTile(p.tileX, p.tileY).watered){
                p.update(time,delta);
            }
        }

        // UPDATE TOOLTIP TEXT CONTINUOUSLY IF ACTIVE
        if (this.tooltipActive && this.lastTooltipTile) {
            const tileData = this.getTile(this.lastTooltipTile.x, this.lastTooltipTile.y);
            
            if (tileData.plant) {
                const plant = tileData.plant;
                
                let timeText = '';
                if (plant.harvestable) {
                    timeText = 'Ready to harvest!';
                } else {
                    const timeLeft = plant.nextStageTimer - plant.growthTimer * this.worldManager.growthModifier;
                    const secondsLeft = Math.ceil(timeLeft / 1000);
                    timeText = `${secondsLeft}s until next stage`;
                }
                
                const stageText = `Stage ${plant.currentStage}/${plant.maxStages}`;
                
                // Update only the text, not position
                this.tooltipStage.setText(stageText);
                this.tooltipTime.setText(timeText);
            }
        }
    }
}