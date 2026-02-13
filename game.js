// Where the game will work together

// Configuration for the game and how it works

// import { Player } from './player.js'; // this imports the player into the map

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

// Preloading images
function preload() {
  this.load.tilemapTiledJSON('mapJson', 'map.json');
  this.load.image('grassTiles', 'assets/GRASS+.png');
}   

function preload() {
  this.load.spritesheet('player', 'assets/char_a_p1_0bas_humn_v00.png');
    frameWidth: 64,
    frameHeight: 64
  });
}


// Creating features including the map and assets
function create() {
  const map = this.make.tilemap({ key: 'mapJson' });
  const tileset = map.addTilesetImage('grass', 'grassTiles');
  map.createLayer('Background', tileset, 0, 0); 
} 

// Updating features and their technicality //to be added
function update() {

}

