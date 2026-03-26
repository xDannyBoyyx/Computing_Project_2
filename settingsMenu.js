import { GameSettings } from './gameSettings.js';

export class SettingsMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsMenu' });
    }

    preload() {
        // Loads the Seed & Soil main menu image
        this.load.image('menuScreen', 'assets/mainmenu.png');
    }

    create() {
        const camera = this.cameras.main;

        // Blocks all background interaction
        let overlay = this.add.rectangle(320, 180, 1280, 720, 0x000000, 0.5)
            .setInteractive(); // this is what blocks clicks

        let container = this.add.rectangle(320, 180, 600, 320, 0xa9ae98, 0.9)
            .setStrokeStyle(2, 0x000000);

        // const blurEffect = camera.postFX.addBlur(1, 1, 1, 0.5, 0xffffff, 4); // quality, x, y, strength, color, steps

        // Add SETTINGS title
        this.add.text(320, 80, 'SETTINGS', {
            fontSize: '28px',
            color: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        
        const parentScene = this.scene.get(this.scene.settings.data.parentScene);

      
    
        // Volume Slider 
        
        const sliderX = 350; 
        const sliderY = 240; 
        const sliderWidth = 120;
        const sliderHeight = 20;
        const dragPadding = 15; // extra vertical space for easier dragging
        const currentVolume = parentScene.backgroundMusic ? parentScene.backgroundMusic.volume : 0.5;

        
        this.volumeText = this.add.text(250, sliderY, 'Volume', {
            fontSize: '20px',
            color: '#000'
        }).setOrigin(0, 0.5);

   
        this.volumeSliderBG = this.add.rectangle(sliderX, sliderY, sliderWidth, sliderHeight, 0x444444)
            .setOrigin(0, 0.5);

        this.volumeSliderFill = this.add.rectangle(sliderX, sliderY, sliderWidth * currentVolume, sliderHeight, 0x2ecc71)
            .setOrigin(0, 0.5);

   
        this.volumePercentText = this.add.text(sliderX + sliderWidth + 10, sliderY, `${Math.round(currentVolume * 100)}%`, {
            fontSize: '16px',
            color: '#000'
        }).setOrigin(0, 0.5);

        // Invisible hit area for easier dragging
        this.volumeSliderHitArea = this.add.rectangle(sliderX, sliderY, sliderWidth, sliderHeight + dragPadding * 2, 0x000000, 0)
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

        
        const updateVolume = (pointerX) => {
            const localX = Phaser.Math.Clamp(pointerX - sliderX, 0, sliderWidth);
            const volume = localX / sliderWidth;

            this.volumeSliderFill.width = localX;
            this.volumePercentText.setText(`${Math.round(volume * 100)}%`);

            if (parentScene.backgroundMusic) parentScene.backgroundMusic.setVolume(volume);
        };

        // Click anywhere on the hit area to set volume
        this.volumeSliderHitArea.on('pointerdown', (pointer) => updateVolume(pointer.x));

        
        this.input.setDraggable(this.volumeSliderHitArea);
        this.input.on('drag', (pointer, gameObject, dragX) => {
            if (gameObject === this.volumeSliderHitArea) updateVolume(dragX);
        });
     
        // time toggle
        
        this.createToggle(
            250, 140, 'Time Mode',
            430, GameSettings.useRealTime,
            (value) => {
                GameSettings.useRealTime = value;
                if (parentScene.worldManager) parentScene.worldManager.refreshTimeAndWeatherMode();
            }
        );

      
        // weather toggle
      
        this.createToggle(
            250, 200, 'Weather',
            430, GameSettings.useRealWeather,
            (value) => {
                GameSettings.useRealWeather = value;
                if (parentScene.worldManager) parentScene.worldManager.refreshTimeAndWeatherMode();
            }
        );

        
        // Close Button
       
        this.createButton(320, 280, 'CLOSE', () => {
            this.scene.stop();
            parentScene.isPaused = false;
            parentScene.menuOpen = false;
        });

      
        // Main Menu Button
    
        this.createButton(320, 320, 'MAIN MENU', () => {
            this.scene.stop();
            this.scene.stop('GameScene');
            this.scene.start('MainMenu');
        });

        // Initial text update for toggles
        this.updateText();
    }


    createToggle(textX, textY, label, toggleX, initialValue, onToggle) {
        const scene = this;

        // Label text
        const labelText = this.add.text(textX, textY, label, { fontSize: '20px', color: '#000' }).setOrigin(0, 0.5);

        // Toggle rectangle
        const toggle = this.add.rectangle(toggleX, textY, 80, 30, 0x444444)
            .setInteractive({ useHandCursor: true });

        // Toggle text
        const toggleText = this.add.text(toggleX, textY, '', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

        toggle.on('pointerdown', () => {
            const newValue = !initialValue;
            initialValue = newValue;
            toggleText.setText(newValue ? 'REAL' : 'PROC');
            toggle.setFillStyle(newValue ? 0x2ecc71 : 0xe74c3c);
            onToggle(newValue);
        });

        this.addHoverEffect(toggle);

        // Store references for updateText()
        if (label === 'Time Mode') {
            this.timeText = labelText;
            this.timeToggle = toggle;
            this.timeToggleText = toggleText;
        } else if (label === 'Weather') {
            this.weatherText = labelText;
            this.weatherToggle = toggle;
            this.weatherToggleText = toggleText;
        }
    }

 
    
    createButton(x, y, label, callback) {
        const btn = this.add.text(x, y, label, {
            fontSize: '20px',
            color: '#000',
            backgroundColor: '#cccccc',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        btn.on('pointerdown', callback);
        this.addHoverEffect(btn);
    }

    updateText() {
        // Update Time Toggle
        this.timeToggleText.setText(GameSettings.useRealTime ? 'REAL' : 'GAME');
        this.timeToggle.setFillStyle(GameSettings.useRealTime ? 0x2ecc71 : 0xe74c3c);

        // Update Weather Toggle
        this.weatherToggleText.setText(GameSettings.useRealWeather ? 'REAL' : 'PROC');
        this.weatherToggle.setFillStyle(GameSettings.useRealWeather ? 0x2ecc71 : 0xe74c3c);
    }

    addHoverEffect(element) {
        element.on('pointerover', () => element.setScale(1.05));
        element.on('pointerout', () => element.setScale(1));
    }
}