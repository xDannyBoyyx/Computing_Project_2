// This is where data for the different kinds of plants will be stored as then it wont be too cluttered on plants.js

export const plantData = {
    "carrot": {
        nextStageTimer: 3000,
        maxStage: 3,
        sellValue: 2,
        harvestMin: 1,
        harvestMax: 4,
        spriteSheet: "smallPlant",
        startFrame: 18
    },
    "raddish": {
        nextStageTimer: 4000,
        maxStage: 3,
        sellValue: 10,
        harvestMin: 1,
        harvestMax: 4,
        spriteSheet: "smallPlant",
        startFrame: 27
    },
    "wheat": {
        nextStageTimer: 3500,
        maxStage: 3,
        sellValue: 16,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 0
    },
    "cabbage": {
        nextStageTimer: 3750,
        maxStage: 3,
        sellValue: 20,
        harvestMin: 2,
        harvestMax: 4,
        spriteSheet: "mediumPlant", 
        startFrame: 20 
    },
    "grape": {
        nextStageTimer: 4500,
        maxStage: 3,
        sellValue: 24,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "largePlant", 
        startFrame: 12
    },
    "chilli": {
        nextStageTimer: 5000,
        maxStage: 3,
        sellValue: 30,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 24
    },
    "cucumber": {
        nextStageTimer: 5500,
        maxStage: 3,
        sellValue: 60,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 12
    },
    "pineapple": {
        nextStageTimer: 6000,
        maxStage: 3,
        sellValue: 90,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "mediumPlant", 
        startFrame: 4
    }
}
