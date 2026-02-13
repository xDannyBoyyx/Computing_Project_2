// Where the game will work together

// Configuration for the game and how it works

import { Player } from './player.js'; // imports the user

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
  
  // puts the character at position (320, 180) - center of the screen
  this.player = new Player(this, 320, 180);

this.cameras.main.startFollow(this.player.sprite);
}
