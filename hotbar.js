export class Hotbar {
    constructor(scene) {
        this.scene = scene;
        this.selectedSlot = 0;
        this.items = new Array(10).fill(null); // Track items in each slot
        this.itemSprites = []; // Visual sprites for items
        
        this.createSlots();
        this.setupKeys();
    }
    
    createSlots() {
        this.slots = [];
        this.itemSprites = [];
        
        let slotSize = 24;
        let spacing = 28;
        let totalSlots = 10;
        
        let totalWidth = totalSlots * spacing;
        let startX = (this.scene.cameras.main.width - totalWidth) / 2 + (spacing / 2);
        
        for (let i = 0; i < 10; i++) {
            let x = startX + (i * spacing);
            let y = 345;
            
            let slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444);
            slot.setStrokeStyle(2, 0xffffff);
            slot.setScrollFactor(0);
            slot.setDepth(100);
            
            let label = i === 9 ? '0' : (i + 1).toString();
            this.scene.add.text(x - 10, y - 10, label, { fontSize: '10px' }).setScrollFactor(0).setDepth(100);
            
            this.slots.push(slot);
            this.itemSprites.push(null); // No item initially
        }
        
        this.highlightSlot();
    }
    
    highlightSlot() {
        for (let i = 0; i < 10; i++) {
            this.slots[i].setStrokeStyle(2, 0xffffff);
        }
        this.slots[this.selectedSlot].setStrokeStyle(2, 0xffff00);
    }
    
    setupKeys() {
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
    
    addItem(itemKey, slotIndex) {
        // Remove old item sprite if exists
        if (this.itemSprites[slotIndex]) {
            this.itemSprites[slotIndex].destroy();
        }
        
        // Add new item
        this.items[slotIndex] = itemKey;
        
        // Create sprite for the item
        let x = this.slots[slotIndex].x;
        let y = this.slots[slotIndex].y;
        
        let sprite = this.scene.add.image(x, y, itemKey);
        sprite.setScale(0.4); // Scale down to fit in slot
        sprite.setScrollFactor(0);
        sprite.setDepth(101);
        sprite.setInteractive({ draggable: true });
        sprite.setData('slotIndex', slotIndex);
        sprite.setData('container', 'hotbar');
        
        this.itemSprites[slotIndex] = sprite;
    }
    
    removeItem(slotIndex) {
        if (this.itemSprites[slotIndex]) {
            this.itemSprites[slotIndex].destroy();
            this.itemSprites[slotIndex] = null;
        }
        this.items[slotIndex] = null;
    }
    
    setVisible(visible) {
        this.slots.forEach(slot => slot.setVisible(visible));
        this.itemSprites.forEach(sprite => {
            if (sprite) sprite.setVisible(visible);
        });
    }
}
