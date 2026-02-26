// Where the game will work together

// Preloading images (background map and teh character
function preload() {
  this.load.tilemapTiledJSON('mapJson', 'map.json');
  this.load.image('grassTiles', 'assets/GRASS+.png');
  this.load.image('Hoe', 'assets/Hoe.png');
  this.load.image('WateringCan','assets/WateringCan.png');

  this.load.spritesheet('player', 'assets/char_a_p1_0bas_humn_v00.png', {
    frameWidth: 64,
    frameHeight: 64
  });

  // Below are the different images used for the different plants
  // reason why there are multiple spritesheets is because we split up the original tileset
  // and remade it to fit the different frame widths and heights better.
  this.load.spritesheet("smallPlant", "assets/SmallPlants.png", {
    frameWidth: 16,
    frameHeight: 32
  });

  this.load.spritesheet("mediumPlant", "assets/MediumPlants.png", {
    frameWidth: 32,
    frameHeight: 32
  });

  this.load.spritesheet("largePlant", "assets/LargePlants.png", {
    frameWidth: 32,
    frameHeight: 40
  });

  // When adding the trees, split them up and add them to the categories above - note to self - D

} // End of preload

import { Player } from './player.js'; // imports the user
import { Hotbar } from './hotbar.js'; //imports the hotbar
import { FarmManager } from './farmManager.js'; // imports the farming mechanics
import { Inventory } from './inventory.js';
import { MainMenu } from './mainMenu.js';

// Creating features or objects and applying them
function create() {

  const map = this.make.tilemap({ key: 'mapJson' });
  const tileset = map.addTilesetImage('grass', 'grassTiles');
  map.createLayer('Background', tileset, 0, 0); 
 
  // Hooks FarmManager into the game file
  this.map = map;

  this.farmManager = new FarmManager(this, map);
  // Couldn't everything below be technically placed in their own class/file?
  // Not actually sure but just curious to then free up space and save confusion.

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
  
  // puts the character at position (320, 200) - center of the screen
  this.player = new Player(this, 320, 200);
  this.cameras.main.startFollow(this.player.sprite);
  this.cameras.main.setBounds(0, 0, 40 * 16, 25 * 16); //40 tiles wide, 25 tiles tall, 16 pixels. 3x bigger now.
  this.physics.world.setBounds(0, 0, 40 * 16, 25 * 16);
  
  this.player.sprite.setCollideWorldBounds(true);

  this.hotbar = new Hotbar(this);

  this.inventory = new Inventory(this);

} // End of create

function update(time, delta) {
  if(this.player) {
    this.player.update();
  }
  
  this.farmManager.update(this.player, time, delta); // Hooks the farming interactions 
} // End of update

// Configuration for the game and how it works
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  pixelArt: true,

  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 0 },
      debug: true //could change to true when debugging
    }
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
}; // End of config

// Creating it via Phaser
const game = new Phaser.Game(config);   
