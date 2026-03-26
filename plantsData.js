// This is where data for the different kinds of plants will be stored as then it wont be too cluttered on plants.js
// Keeping the next stage timers quite low to ensure it doesn't take too long but also not too short for crops to grow.
export const plantData = {
    "carrot": {
        nextStageTimer: 30000,
        maxStage: 3,
        sellValue: 2,
        harvestMin: 1,
        harvestMax: 4,
        spriteSheet: "smallPlant",
        startFrame: 18
    },
    "raddish": {
        nextStageTimer: 40000,
        maxStage: 3,
        sellValue: 10,
        harvestMin: 1,
        harvestMax: 4,
        spriteSheet: "smallPlant",
        startFrame: 27
    },
    "wheat": {
        nextStageTimer: 35000,
        maxStage: 3,
        sellValue: 16,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 0
    },
    "cabbage": {
        nextStageTimer: 37500,
        maxStage: 3,
        sellValue: 20,
        harvestMin: 2,
        harvestMax: 4,
        spriteSheet: "mediumPlant", 
        startFrame: 20 
    },
    "grape": {
        nextStageTimer: 45000,
        maxStage: 3,
        sellValue: 24,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "largePlant", 
        startFrame: 12
    },
    "chilli": {
        nextStageTimer: 50000,
        maxStage: 3,
        sellValue: 30,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 24
    },
    "cucumber": {
        nextStageTimer: 55000,
        maxStage: 3,
        sellValue: 60,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 12
    },
    "pineapple": {
        nextStageTimer: 60000,
        maxStage: 3,
        sellValue: 90,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 4
    },
    "pumpkin": {
        nextStageTimer: 65000,
        maxStage: 3,
        sellValue: 140,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 8
    },
    "climbBeans": {
        nextStageTimer: 70000,
        maxStage: 3,
        sellValue: 200,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "largePlant", 
        startFrame: 4
    },
    "sunflower": {
        nextStageTimer: 75000,
        maxStage: 3,
        sellValue: 300,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "largePlant",
        startFrame: 0
    },
    "brwnMush": {
        nextStageTimer: 85000,
        maxStage: 3,
        sellValue: 400,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "smallPlant",
        startFrame: 4
    },
    "whteMush": {
        nextStageTimer: 100000,
        maxStage: 3,
        sellValue: 500,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "smallPlant",
        startFrame: 12
    }
}
