export class SettingsMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsMenu' });
    }
    
    preload() {
        // Loads the Seed & Soil main menu image
        this.load.image('menuScreen', 'assets/mainmenu.png');
    }
    
    create() {
        // this.cameras.main.setBackgroundColor('#950707');
        // this.add.image(320, 180, 'wheatPouch');

        const camera = this.cameras.main;
        let container = this.add.rectangle(320, 180, 600, 320, 0xa9ae98, 0.5); // 0 = invisible, 0.5 to show outline of buttons
        const blurEffect = camera.postFX.addBlur(3, 2, 2, 1, 0xffffff, 6); // quality, x, y, strength, color, steps


        // startButton.setInteractive({ useHandCursor: true });
        // startButton.on('pointerdown', () => {
        //     this.scene.start('GameScene');
        // });
        
        // // OPTIONS button
        // let optionsButton = this.add.rectangle(315, 235, 165, 40, 0x000000, 0);
        // optionsButton.setInteractive({ useHandCursor: true });
        // optionsButton.on('pointerdown', () => {
        //     console.log('Options clicked');
        //     this.scene.launch('SettingsMenu');
        // });
        
        // // EXIT button
        // let exitButton = this.add.rectangle(315, 280, 165, 40, 0x000000, 0);
        // exitButton.setDepth(1000);
        // exitButton.setInteractive({ useHandCursor: true });
        // exitButton.on('pointerdown', () => {
        //     window.close();
        // });
    }
}
