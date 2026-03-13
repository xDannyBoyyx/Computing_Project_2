export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
        this.selectedGender = 'male'; // Default selection
    }
    
    preload() {
        // Loads the Seed & Soil main menu image
        this.load.image('menuScreen', 'assets/mainmenu.png');
        
        // Load character sprites for preview
        this.load.spritesheet('playerMale', 'assets/maleSS.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('playerFemale', 'assets/femaleSS.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#fdf5ea');
        this.add.image(320, 180, 'menuScreen');
        
        // Character preview (top right corner)
        this.characterPreview = this.add.sprite(550, 100, 'playerMale', 0)
            .setScale(1.5);
        
        // Character label
        this.genderLabel = this.add.text(550, 150, 'Male', {
            fontSize: '16px',
            color: '#8b7355',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Toggle button (click character to change)
        let toggleArea = this.add.rectangle(550, 100, 80, 80, 0x000000, 0)
            .setInteractive({ useHandCursor: true });
        
        toggleArea.on('pointerdown', () => {
            this.toggleGender();
        });
        
        // START button (x, y, width, height)
        let startButton = this.add.rectangle(315, 190, 165, 40, 0x000000, 0); // 0 = invisible, 0.5 to show outline of buttons
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', () => {
            // Pass selected gender to game
            this.scene.start('GameScene', { gender: this.selectedGender });
        });
        
        // OPTIONS button
        let optionsButton = this.add.rectangle(315, 235, 165, 40, 0x000000, 0);
        optionsButton.setInteractive({ useHandCursor: true });
        optionsButton.on('pointerdown', () => {
            console.log('Options clicked');
        });
        
        // EXIT button
        let exitButton = this.add.rectangle(315, 280, 165, 40, 0x000000, 0);
        exitButton.setDepth(1000);
        exitButton.setInteractive({ useHandCursor: true });
        exitButton.on('pointerdown', () => {
            window.close();
        });
    }
    
    toggleGender() {
        this.selectedGender = this.selectedGender === 'male' ? 'female' : 'male';
        
        // Update preview sprite
        if (this.selectedGender === 'male') {
            this.characterPreview.setTexture('playerMale', 0);
            this.genderLabel.setText('Male');
        } else {
            this.characterPreview.setTexture('playerFemale', 0);
            this.genderLabel.setText('Female');
        }
    }
}
