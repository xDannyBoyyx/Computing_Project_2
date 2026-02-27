export class EconomyManager {
    constructor(scene, startingGold = 0) {
        this.scene = scene;
        this.gold = startingGold;

        this.createUI();
    }

    createUI() {
        // displays top right
        this.goldText = this.scene.add.text(
            620, 20,                  
            `Gold: ${this.gold}`,      
            { fontSize: '18px', color: '#FFD700', fontStyle: 'bold' }
        ).setOrigin(1, 0);           
        this.goldText.setScrollFactor(0); 
        this.goldText.setDepth(1000);    // above everything
    }

    addGold(amount) {
        this.gold += amount;
        this.updateUI();
    }

    spendGold(amount) {
        if (amount > this.gold) return false; 
        this.gold -= amount;
        this.updateUI();
        return true;
    }

    setGold(amount) {
        this.gold = amount;
        this.updateUI();
    }

    updateUI() {
        this.goldText.setText(`Gold: ${this.gold}`);
    }
}