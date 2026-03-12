// This is where data for the different kinds of plants will be stored as then it wont be too cluttered on plants.js

export const plantData = {
    "carrot": {
        nextStageTimer: 3000,
        maxStage: 3,
        sellValue: 5,
        harvestMin: 1,
        harvestMax: 4,
        spriteSheet: "smallPlant",
        startFrame: 18
    },
    "radish": {
        nextStageTimer: 4000,
        maxStage: 3,
        sellValue: 7,
        harvestMin: 1,
        harvestMax: 4,
        spriteSheet: "smallPlant",
        startFrame: 27
    },
    "wheat": {
        nextStageTimer: 3500,
        maxStage: 3,
        sellValue: 6,
        harvestMin: 2,
        harvestMax: 5,
        spriteSheet: "largePlant", 
        startFrame: 0
    }
}
