export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Create sprite from spritesheet
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        
        this.speed = 160;
        
        // Set up keyboard controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }
    
    update() {
        // Reset velocity
        this.sprite.body.setVelocity(0);
        
        // Horizontal movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.sprite.body.setVelocityX(this.speed);
            this.sprite.anims.play('walk-right', true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.sprite.body.setVelocityX(-this.speed);
            this.sprite.anims.play('walk-left', true);
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.sprite.body.setVelocityY(-this.speed);
            this.sprite.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.sprite.body.setVelocityY(this.speed);
            this.sprite.anims.play('walk-down', true);
        } else {
            this.sprite.anims.stop();
        }
    }
}
