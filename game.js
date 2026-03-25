import { MainMenu } from './mainMenu.js';
import { SettingsMenu } from './settingsMenu.js';

import { WorldManager } from './worldManager.js';
import { FarmManager } from './farmManager.js';
import { EconomyManager } from './economyManager.js';

import { Player } from './player.js';
import { Merchant } from './merchant.js';
import { MerchantNPC } from './merchant_npc.js';

import { Hotbar } from './hotbar.js';
import { Inventory } from './inventory.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  
  preload() {
    // Background/map
    this.load.tilemapTiledJSON('mapJson', 'map.json');
    this.load.image('grassTiles', 'assets/GRASS+.png');

    // General UI and weather
    this.load.image('timeBG', 'assets/timebg.png');
    this.load.image('sunny', 'assets/weatherIcons/sunny.png');
    this.load.image('night', 'assets/weatherIcons/night.png');
    this.load.image('sunnyCloud', 'assets/weatherIcons/sunnyCloud.png');
    this.load.image('cloudy', 'assets/weatherIcons/cloudy.png');
    this.load.image('windy', 'assets/weatherIcons/windy.png');
    this.load.image('rain', 'assets/weatherIcons/rain.png');
    this.load.image('storm', 'assets/weatherIcons/storm.png');
    this.load.image('dry heat', 'assets/weatherIcons/hot.png');
    this.load.image('snow', 'assets/weatherIcons/snow.png');
    this.load.image('blizzard', 'assets/weatherIcons/blizzard.png');

    // Tools
    this.load.image('Hoe', 'assets/Hoe.png');
    this.load.image('WateringCan','assets/WateringCan.png');
    this.load.image('Axe', 'assets/Axe.png');
    this.load.image('Hammer', 'assets/Hammer.png');
    this.load.image('Pickaxe', 'assets/Pickaxe.png');
    this.load.image('Scythe', 'assets/Scythe.png'); 
    this.load.image('Shovel', 'assets/Shovel.png');

    // Pouches
    this.load.image('wheatPouch', 'assets/pouches/wheatPouch.png');
    this.load.image('carrotPouch', 'assets/pouches/carrotPouch.png');
    this.load.image('raddishPouch', 'assets/pouches/raddishPouch.png');
    this.load.image('cabbagePouch', 'assets/pouches/cabbagePouch.png');
    this.load.image('grapePouch', 'assets/pouches/grapePouch.png');
    this.load.image('chilliPouch', 'assets/pouches/chilliPouch.png');
    this.load.image('cucumberPouch', 'assets/pouches/cucumberPouch.png');
    this.load.image('pineapplePouch', 'assets/pouches/pineapplePouch.png');
    this.load.image('pumpkinPouch', 'assets/pouches/pumpkinPouch.png');
    
    // Spritesheets VVV

    // Male sprite
    this.load.spritesheet('player', 'assets/maleSS.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    // Female sprite
    this.load.spritesheet('playerFemale', 'assets/femaleSS.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    // Small plants
    this.load.spritesheet("smallPlant", "assets/SmallPlants.png", {
      frameWidth: 16,
      frameHeight: 32
    });

    // Medium plants
    this.load.spritesheet("mediumPlant", "assets/MediumPlants.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    // Large plants
    this.load.spritesheet("largePlant", "assets/LargePlants.png", {
      frameWidth: 32,
      frameHeight: 40
    });

    // Background audio
    this.load.audio("farmMusic", "assets/Magic Scout - Farm.mp3");

    // Merchant animations
    this.load.spritesheet('Merchant_Idle', 'assets/Merchant_Idle.png', {
      frameWidth: 28, 
      frameHeight:28,
    });

    this.load.spritesheet('Merchant_Walk', 'assets/Merchant_Walk.png', {
      frameWidth: 64, 
      frameHeight: 64,
    });
  }
  
  create(data) { // 'data' parameter to receive information from menu (e.g. gender)
    const map = this.make.tilemap({ key: 'mapJson' });
    const tileset = map.addTilesetImage('grass', 'grassTiles');
    const ground = map.createLayer('Background', tileset, 0, 0); 
   
    this.worldManager = new WorldManager(this);
    this.worldManager.createUI();
    this.farmManager = new FarmManager(this, map, this.worldManager);
    this.economy = new EconomyManager(this, 100); // Number argument = gold
    this.merchant = new Merchant(this);
    this.merchant.initUI();
     
    // Get selected gender from main menu (defaults to 'male' if not provided)
    const selectedGender = data.gender || 'male';
    const spriteKey = selectedGender === 'male' ? 'player' : 'playerFemale';

    // Harvesting 
    this.harvestKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // Creating moving animations but in specific order from spritesheet as it works weirdly
    this.anims.create({
      key: 'move-down',
      frames: this.anims.generateFrameNumbers(spriteKey, {  frames: [15, 14, 13, 12, 0, 1, 2, 3] }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'move-up',
      frames: this.anims.generateFrameNumbers(spriteKey, { frames: [4, 5, 6, 7, 11, 10, 9, 8] }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'move-left',
      frames: this.anims.generateFrameNumbers(spriteKey, { frames: [31, 30, 29, 25, 28, 27, 26, 24] }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'move-right',
      frames: this.anims.generateFrameNumbers(spriteKey, { frames: [16, 17, 18, 22, 19, 20, 21, 23] }),
      frameRate: 10,
      repeat: -1
    });

    this.player = new Player(this, 320, 100, selectedGender); // Pass gender to player
  
    this.merchantNPC = new MerchantNPC(this, 100, 100, this.player, this.merchant); // change the number arguments if you want to move the merchant (100, left, 300, bottom)

    // Ensuring camera follows player and there are boundaries to where the camera can go
    this.cameras.main.startFollow(this.player.sprite, true);
    this.cameras.main.setBounds(0, 0, 40 * 16, 25 * 16);
    this.physics.world.setBounds(0, 0, 40 * 16, 25 * 16);
    
    // Ensuring player can't leave map and UI's are created
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
    if (!this.isUIOpen) {
        this.player.update();
        this.farmManager.update(this.player, time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.harvestKey)) {
            this.farmManager.tryHarvest(this.player);
        }
    }

    this.worldManager.update(time, delta);
    this.merchant.update(time, delta);
    this.merchantNPC.update(); 
}
}

// Configurations to how the game will work using Phaser's config
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
    noAudio: true
  },
  scene: [MainMenu,GameScene,SettingsMenu] //Switch MainMenu & GameScene if you don't want to see the main menu every time.
};

// Creating the game
const game = new Phaser.Game(config);   

game.sound.pauseOnBlur = false; //this keeps the music playing when the tab is inactive
