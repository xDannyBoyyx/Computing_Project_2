// Where the game will work together

// Configuration for the game and how it works

import { Player } from './player.js'; // imports the user

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,

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

  // this.add.tileSprite(0, 0, 4000, 4000, 'grassTiles').setOrigin(0,0);
  const map = this.make.tilemap({ key: 'mapJson' });
  const tileset = map.addTilesetImage('grass', 'grassTiles');
  map.createLayer('Background', tileset, 0, 0); 



  // for(let row = 0; row < 3; row++) {
  //   for(let col= 0; col <3; col++) {
  //     const layer = map.createLayer('Background', tileset, col * 640, row * 400);
  //   }
  // }

  
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
}

function update() {
  if(this.player) {
    this.player.update();
  }
}





