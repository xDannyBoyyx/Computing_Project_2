export class MerchantNPC {
    constructor(scene, x, y, player, merchantUI) {
        this.scene = scene;
        this.player = player;
        this.merchantUI = merchantUI;

      
        this.sprite = scene.physics.add.sprite(x, y, 'Merchant_Idle');

        
        this.sprite.setScale(1.5); 
        this.sprite.setImmovable(true);

        
        this.sprite.anims.play('merchant-idle', true);

        this.interactionRadius = 60;

        // Hint text above NPC
        this.interactHint = scene.add.text(x, y - 50, 'Press E to trade', {
            fontSize: '14px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.interactHint.setVisible(false);

        // Press E to interact
        scene.input.keyboard.on('keydown-E', () => {
            const dist = Phaser.Math.Distance.Between(
                this.sprite.x, this.sprite.y,
                this.player.sprite.x, this.player.sprite.y
            );
            if (dist < this.interactionRadius) {
                this.merchantUI.toggle();
            }
        });
    }

  update() {
    
    this.sprite.setDepth(this.sprite.y);

    // Show hint if player is close
    const dist = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        this.player.sprite.x, this.player.sprite.y
    );
    this.interactHint.setVisible(dist < this.interactionRadius);

    // Updates the hint position dynamically above the sprite as I was having issues when adjusting the scale
    this.interactHint.x = this.sprite.x;
    this.interactHint.y = this.sprite.y - (this.sprite.displayHeight / 2 + 10);
}
}