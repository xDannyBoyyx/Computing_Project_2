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
        for (let i = 0; i < 5; i++) {
            // Position: spread across bottom of screen
            let x = 220 + (i * 60); // spacing of 60 pixels
            let y = 330; // near bottom
            
            // Draw the slot box
            let slot = this.scene.add.rectangle(x, y, 50, 50, 0x444444);
            slot.setStrokeStyle(3, 0xffffff);
            slot.setScrollFactor(0); // Don't move with camera
            
            // Add number label
            this.scene.add.text(x - 20, y - 20, i + 1, { fontSize: '16px' }).setScrollFactor(0);
            
            this.slots.push(slot);
        }
        
        // Highlight first slot
        this.highlightSlot();
    }
    
    highlightSlot() {
        // Reset all slots to white border
        for (let i = 0; i < 5; i++) {
            this.slots[i].setStrokeStyle(3, 0xffffff);
        }
        
        // Make selected slot yellow
        this.slots[this.selectedSlot].setStrokeStyle(3, 0xffff00);
    }
    
    setupKeys() {
        // Press 1-5 to select slots
        this.scene.input.keyboard.on('keydown-ONE', () => this.selectSlot(0));
        this.scene.input.keyboard.on('keydown-TWO', () => this.selectSlot(1));
        this.scene.input.keyboard.on('keydown-THREE', () => this.selectSlot(2));
        this.scene.input.keyboard.on('keydown-FOUR', () => this.selectSlot(3));
        this.scene.input.keyboard.on('keydown-FIVE', () => this.selectSlot(4));
    }
    
    selectSlot(slotNumber) {
        this.selectedSlot = slotNumber;
        this.highlightSlot();
    }
}
