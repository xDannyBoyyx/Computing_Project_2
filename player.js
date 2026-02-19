export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        // Did this.scene = scene but not this.x = x and this.y = y?
        
        // adds the correct character sprite from the spritesheet
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        
        this.speed = 160;
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }
    
    // !!! Please leave comments for what the different functionalities do !!! -D

    update() {
        this.sprite.body.setVelocity(0);
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.sprite.body.setVelocityX(-this.speed);
            this.sprite.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.sprite.body.setVelocityX(this.speed);
            this.sprite.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.sprite.body.setVelocityY(-this.speed);
            this.sprite.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.sprite.body.setVelocityY(this.speed);
            this.sprite.anims.play('walk-down', true);
        } else {
            this.sprite.anims.stop();
        } // I think personally this line above ^ is whats causing the sprite look as if its constantly still
        // when only tapping the movement keys rather than holding them, also maybe use a switch statement to make 
        // it look better and per chance work better but do compare and document. -D
    }
}
