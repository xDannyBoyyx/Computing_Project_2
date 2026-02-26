import { Player } from './player.js';
import { Hotbar } from './hotbar.js';
import { FarmManager } from './farmManager.js';
import { Inventory } from './inventory.js';
import { MainMenu } from './mainMenu.js';

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MainMenu, GameScene]
};

// Creating it via Phaser
const game = new Phaser.Game(config);

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  
  preload() {
    this.load.tilemapTiledJSON('mapJson', 'map.json');
    this.load.image('grassTiles', 'assets/GRASS+.png');
    this.load.image('Hoe', 'assets/Hoe.png');
    this.load.image('WateringCan','assets/WateringCan.png');
    this.load.spritesheet('player', 'assets/char_a_p1_0bas_humn_v00.png', {
      frameWidth: 64,
      frameHeight: 64
    });
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
  }
  
  create() {
    const map = this.make.tilemap({ key: 'mapJson' });
    const tileset = map.addTilesetImage('grass', 'grassTiles');
    map.createLayer('Background', tileset, 0, 0); 
   
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
    
    this.player = new Player(this, 320, 200);
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 40 * 16, 25 * 16);
    this.physics.world.setBounds(0, 0, 40 * 16, 25 * 16);
    
    this.player.sprite.setCollideWorldBounds(true);
    this.hotbar = new Hotbar(this);
    this.inventory = new Inventory(this);
  }
  
  update(time, delta) {
    if(this.player) {
      this.player.update();
    }
    
    this.farmManager.update(this.player, time, delta);
  }
}   
