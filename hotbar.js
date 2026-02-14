export class Hotbar {
    constructor(scene) {
        this.scene = scene;
        this.selectedSlot = 0; // Which slot is selected (0-4)
        
        this.createSlots();
        this.setupKeys();
    }
    
    createSlots() {
        this.slots = [];
        
        // Create 5 slots
        for (let i = 0; i < 10; i++) {
        // Position: spread across bottom of screen
        let x = 160 + (i * 40); // adjusted to center better
        let y = 320; // adjusted position
        
        // Draw the slot box
        let slot = this.scene.add.rectangle(x, y, 35, 35, 0x444444);
        slot.setStrokeStyle(2, 0xffffff);
        slot.setScrollFactor(0);
        
        // Add number label (show 0 for last slot)
        let label = i === 9 ? '0' : (i + 1).toString();
        this.scene.add.text(x - 15, y - 15, label, { fontSize: '12px' }).setScrollFactor(0)
            
            this.slots.push(slot);
        }
        
        // Highlight first slot
        this.highlightSlot();
    }
    
    highlightSlot() {
        for (let i = 0; i < 10; i++) {
            this.slots[i].setStrokeStyle(3, 0xffffff);
        }
        
        this.slots[this.selectedSlot].setStrokeStyle(3, 0xffff00);
    }
    
    setupKeys() {
        // press 1-10 to select slots
        this.scene.input.keyboard.on('keydown-ONE', () => this.selectSlot(0));
        this.scene.input.keyboard.on('keydown-TWO', () => this.selectSlot(1));
        this.scene.input.keyboard.on('keydown-THREE', () => this.selectSlot(2));
        this.scene.input.keyboard.on('keydown-FOUR', () => this.selectSlot(3));
        this.scene.input.keyboard.on('keydown-FIVE', () => this.selectSlot(4));
        this.scene.input.keyboard.on('keydown-SIX', () => this.selectSlot(5));
        this.scene.input.keyboard.on('keydown-SEVEN', () => this.selectSlot(6));
        this.scene.input.keyboard.on('keydown-EIGHT', () => this.selectSlot(7));
        this.scene.input.keyboard.on('keydown-NINE', () => this.selectSlot(8));
        this.scene.input.keyboard.on('keydown-ZERO', () => this.selectSlot(9));
    }
    
    selectSlot(slotNumber) {
        this.selectedSlot = slotNumber;
        this.highlightSlot();
    }
}
