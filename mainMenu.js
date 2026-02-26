export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }
    
    preload() {
        // Loads the Seed & Soil main menu image
        this.load.image('menuScreen', 'assets/mainmenu.png');
    }
    
    create() {
        this.add.image(320, 180, 'menuScreen').setScale(0.5);
        
        // START button (adjust x, y, width, height to match the image)
        let startButton = this.add.rectangle(320, 170, 420, 50, 0x000000, 0.5); // 0 alpha = invisible
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // OPTIONS button
        let optionsButton = this.add.rectangle(320, 230, 420, 50, 0x000000, 0.5);
        optionsButton.setInteractive({ useHandCursor: true });
        optionsButton.on('pointerdown', () => {
            console.log('Options clicked');
        });
        
        // EXIT button
        let exitButton = this.add.rectangle(320, 290, 420, 50, 0x000000, 0.5);
        exitButton.setInteractive({ useHandCursor: true });
        exitButton.on('pointerdown', () => {
            window.close();
        });
    }
}
