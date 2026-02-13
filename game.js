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

// // ADD THIS: Load player spritesheet
//   this.load.spritesheet('player', 'assets/sprites/player.png', {
//     frameWidth: 64,
//     frameHeight: 64
//   });

// Creating features including the map and assets
function create() {
  const map = this.make.tilemap({ key: 'mapJson' });
  const tileset = map.addTilesetImage('grass', 'grassTiles');
  map.createLayer('Background', tileset, 0, 0); 
} 

// Updating features and their technicality //to be added
function update() {

}




// create() {
//     // Walking down (row 4)
//     this.anims.create({
//         key: 'walk-down',
//         frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
//         frameRate: 10,
//         repeat: -1
//     });
    
//     // Walking up (row 5)
//     this.anims.create({
//         key: 'walk-up',
//         frames: this.anims.generateFrameNumbers('player', { start: 40, end: 47 }),
//         frameRate: 10,
//         repeat: -1
//     });
    
//     // Walking left (row 6)
//     this.anims.create({
//         key: 'walk-left',
//         frames: this.anims.generateFrameNumbers('player', { start: 48, end: 55 }),
//         frameRate: 10,
//         repeat: -1
//     });
    
//     // Walking right (row 7)
//     this.anims.create({
//         key: 'walk-right',
//         frames: this.anims.generateFrameNumbers('player', { start: 56, end: 63 }),
//         frameRate: 10,
//         repeat: -1
//     });
    
//     this.player = new Player(this, 320, 180);
// }

// // Updating features and their technicality
// function update() {
//   // ADD THIS: Update player
//   if (this.player) {
//     this.player.update();
//   }
// }


// preload() {
//     this.load.spritesheet('player', 'assets/sprites/player.png', {
//         frameWidth: 64,  // the sprite looks like 64x64
//         frameHeight: 64
//     });
// }

