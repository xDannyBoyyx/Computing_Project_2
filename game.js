// Where the game will work together

// Configuration for the game and how it works

import { Player } from './player.js'; // imports the user
import { Hotbar } from './hotbar.js'; //imports the hotbar
import { FarmManager } from './farmManager.js'; // imports the farming mechanics

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,

  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 0 },
      debug: false //could change to true when debugging
    }
  },

  render: {
    pixelArt: true
  },

  scale: {
    mode: Phaser.Scale.FIT, // May change to fit better
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Creating it via Phaser
const game = new Phaser.Game(config);   

// Preloading images (background map and teh character
function preload() {
  this.load.tilemapTiledJSON('mapJson', 'map.json');
  this.load.image('grassTiles', 'assets/GRASS+.png');

  this.load.spritesheet('player', 'assets/char_a_p1_0bas_humn_v00.png', {
    frameWidth: 64,
    frameHeight: 64
  });
}

function create() {

  const map = this.make.tilemap({ key: 'mapJson' });
  const tileset = map.addTilesetImage('grass', 'grassTiles');
  map.createLayer('Background', tileset, 0, 0); 

 
  // Hooks FarmManager into the game file
  this.map = map;
  this.farmManager = new FarmManager(this, map);
  
  this.anims.create({
    key: 'walk-down',
    frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
    frameRate: 10,
    repeat: -1
  });
  
  this.anims.create({
    key: 'walk-up',
    frames: this.anims.generateFrameNumbers('player', { start: 40, end: 47 }),
    frameRate: 10,
    repeat: -1
  });
  
  this.anims.create({
    key: 'walk-left',
    frames: this.anims.generateFrameNumbers('player', { start: 56, end: 63 }),
    frameRate: 10,
    repeat: -1
  });
  
  this.anims.create({
    key: 'walk-right',
    frames: this.anims.generateFrameNumbers('player', { start: 48, end: 55 }),
    frameRate: 10,
    repeat: -1
  });
   
  // Adds mouse input
  this.input.on('pointerdown', (pointer) => {
    const worldPoint = pointer.positionToCamera(this.cameras.main);

    const tile = worldToTileXY(worldPoint.x, worldPoint.y);

    if (pointer.leftButtonDown()) {
        this.handleFarmAction(tile.x, tile.y, "primary");
    }

    if (pointer.rightButtonDown()) {
        this.handleFarmAction(tile.x, tile.y, "secondary");
    }
});


  // Adds keyboard input
  this.interactKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
  );


  // Farming interaction logic
  this.handleFarmAction = (x, y, type) => {
      const farm = this.farmManager;
      const tile = farm.getTile(x, y);

      if (type === "primary") {
          // Till → Plant → Harvest
          if (!tile.tilled) {
              farm.till(x, y);
          } else if (!tile.crop) {
              farm.plant(x, y, "wheat");
          } else {
              console.log("Harvest not implemented yet");
          }
      }

      if (type === "secondary") {
          // Watering
          farm.water(x, y);
      }
  };

  
  // puts the character at position (320, 200) - center of the screen
  this.player = new Player(this, 320, 200);
  this.cameras.main.startFollow(this.player.sprite);
  this.cameras.main.setBounds(0, 0, 40 * 16, 25 * 16); //40 tiles wide, 25 tiles tall, 16 pixels. 3x bigger now.
  this.physics.world.setBounds(0, 0, 40 * 16, 25 * 16);
  
  this.player.sprite.setCollideWorldBounds(true);

  this.hotbar = new Hotbar(this);
}

function update() {
  if(this.player) {
    this.player.update();
  }

  if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
    const player = this.player.sprite;

    const tile = worldToTileXY(player.x, player.y);

    this.handleFarmAction(tile.x, tile.y, "primary");
  }
}

// Converts the mouse position into a tile coordinate.
function worldToTileXY(worldX, worldY) {
  const tileSize = 16;
  return {
    x: Math.floor(worldX / tileSize),
    y: Math.floor(worldY / tileSize)
  };
}





