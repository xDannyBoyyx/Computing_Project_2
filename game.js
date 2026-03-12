import { MainMenu } from './mainMenu.js';
import { Hotbar } from './hotbar.js';
import { Inventory } from './inventory.js';

import { WorldManager } from './worldManager.js';
import { FarmManager } from './farmManager.js';
import { EconomyManager } from './economyManager.js';

import { Player } from './player.js';
import { Merchant } from './merchant.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  
  preload() {
    this.load.tilemapTiledJSON('mapJson', 'map.json');
    this.load.image('grassTiles', 'assets/GRASS+.png');
    this.load.image('Hoe', 'assets/Hoe.png');
    this.load.image('WateringCan','assets/WateringCan.png');
    this.load.image('Axe', 'assets/Axe.png');
    this.load.image('Hammer', 'assets/Hammer.png');
    this.load.image('Pickaxe', 'assets/Pickaxe.png');
    this.load.image('Scythe', 'assets/Scythe.png'); 
    this.load.image('Shovel', 'assets/Shovel.png');
    this.load.image('wheatPouch', 'assets/pouches/wheatPouch.png');
    this.load.image('carrotPouch', 'assets/pouches/carrotPouch.png');
    this.load.image('radishPouch', 'assets/pouches/radishPouch.png');
    
    this.load.spritesheet('player', 'assets/maleSS.png', {
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
    this.load.audio("farmMusic", "assets/Magic Scout - Farm.mp3");
  }
  
  create() {
    const map = this.make.tilemap({ key: 'mapJson' });
    const tileset = map.addTilesetImage('grass', 'grassTiles');
    const ground = map.createLayer('Background', tileset, 0, 0); 
   
    this.farmManager = new FarmManager(this, map);
    // the number argument = gold, so change it to whatever you want 
    this.economy = new EconomyManager(this, 100); 
    this.merchant = new Merchant(this);
    this.worldManager = new WorldManager(this);
    this.worldManager.createUI();
     
    
    this.anims.create({
      key: 'move-down',
      frames: this.anims.generateFrameNumbers('player', {  frames: [15, 14, 13, 12, 0, 1, 2, 3] }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'move-up',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 5, 6, 7, 11, 10, 9, 8] }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'move-left',
      frames: this.anims.generateFrameNumbers('player', { frames: [31, 30, 29, 25, 28, 27, 26, 24] }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'move-right',
      frames: this.anims.generateFrameNumbers('player', { frames: [16, 17, 18, 22, 19, 20, 21, 23] }),
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
    this.isUIOpen = false;

    this.backgroundMusic = this.sound.add('farmMusic', {
      volume: 0.5,   // 0.0 = silent & 1.0 = full volume
      loop: true     // loop the song
    });

    this.backgroundMusic.play();
  }
  
  update(time, delta) {
    // Stops gameplay if inv is open
    if (this.isUIOpen) {
      return;
    }
 
    if(this.player) {
      this.player.update();
    }

    this.farmManager.update(this.player, time, delta);
    this.merchant.update(time, delta);
    this.worldManager.update(time,delta);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  audio: {               
    disableWebAudio: false, // this makes it so the music still plays when on another tab
    noAudio: false
  },
  scene: [MainMenu,GameScene] //Switch MainMenu & GameScene if you don't want to see the main menu every time.
};

const game = new Phaser.Game(config);   

game.sound.pauseOnBlur = false; //this keeps the music playing when the tab is inactive
