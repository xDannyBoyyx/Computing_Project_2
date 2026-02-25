export class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.slots = [];
        this.items = new Array(30).fill(null);
        this.itemSprites = new Array(30).fill(null);
        
        this.createInventory();
        this.setupControls();
        this.setupDragDrop();
    }
    
    createInventory() {
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(500);
        this.container.setVisible(false);
        
        let overlay = this.scene.add.rectangle(320, 180, 640, 360, 0x000000, 0.7);
        overlay.setScrollFactor(0);
        this.container.add(overlay);
        
        let panel = this.scene.add.rectangle(320, 180, 400, 250, 0x2a2a2a);
        panel.setStrokeStyle(3, 0xffffff);
        this.container.add(panel);
        
        let title = this.scene.add.text(320, 85, 'INVENTORY', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(title);
        
        let startX = 155;
        let startY = 120;
        let slotSize = 32;
        let spacing = 37;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 10; col++) {
                let x = startX + (col * spacing);
                let y = startY + (row * spacing);
                
                let slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444);
                slot.setStrokeStyle(2, 0x888888);
                slot.setData('slotIndex', row * 10 + col);
                
                this.container.add(slot);
                this.slots.push(slot);
            }
        }
        
        let closeHint = this.scene.add.text(320, 280, 'Press I to close', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.container.add(closeHint);
    }
    
    setupControls() {
        this.scene.input.keyboard.on('keydown-I', () => {
            this.toggle();
        });
    }
    
    setupDragDrop() {
        let draggedItem = null;
        let originalX = 0;
        let originalY = 0;
        
        // When dragging starts
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            draggedItem = gameObject;
            originalX = gameObject.x;
            originalY = gameObject.y;
            gameObject.setDepth(1000);
        });
        
        // While dragging
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
        });
        
        // When dropping
        this.scene.input.on('dragend', (pointer, gameObject) => {
            let dropped = false;
            
            // Check if dropped on inventory slot
            for (let i = 0; i < this.slots.length; i++) {
                let slot = this.slots[i];
                let bounds = slot.getBounds();
                
                if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
                    // Move item to inventory
                    let itemKey = gameObject.texture.key;
                    this.addItem(itemKey, i);
                    
                    // Remove from hotbar
                    let fromSlot = gameObject.getData('slotIndex');
                    this.scene.hotbar.removeItem(fromSlot);
                    
                    dropped = true;
                    break;
                }
            }
            
            // Check if dropped on hotbar slot
            if (!dropped) {
                for (let i = 0; i < this.scene.hotbar.slots.length; i++) {
                    let slot = this.scene.hotbar.slots[i];
                    let bounds = slot.getBounds();
                    
                    if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
                        let itemKey = gameObject.texture.key;
                        this.scene.hotbar.addItem(itemKey, i);
                        
                        // Remove from inventory if it came from there
                        if (gameObject.getData('container') === 'inventory') {
                            let fromSlot = gameObject.getData('slotIndex');
                            this.removeItem(fromSlot);
                        }
                        
                        dropped = true;
                        break;
                    }
                }
            }
            
            // If not dropped anywhere valid, return to original position
            if (!dropped) {
                gameObject.x = originalX;
                gameObject.y = originalY;
                gameObject.setDepth(101);
            }
        });
    }
    
    addItem(itemKey, slotIndex) {
        if (this.itemSprites[slotIndex]) {
            this.itemSprites[slotIndex].destroy();
        }
        
        this.items[slotIndex] = itemKey;
        
        let x = this.slots[slotIndex].x;
        let y = this.slots[slotIndex].y;
        
        let sprite = this.scene.add.image(x, y, itemKey);
        sprite.setScale(0.5);
        sprite.setScrollFactor(0);
        sprite.setDepth(501);
        sprite.setInteractive({ draggable: true });
        sprite.setData('slotIndex', slotIndex);
        sprite.setData('container', 'inventory');
        
        this.container.add(sprite);
        this.itemSprites[slotIndex] = sprite;
    }
    
    removeItem(slotIndex) {
        if (this.itemSprites[slotIndex]) {
            this.itemSprites[slotIndex].destroy();
            this.itemSprites[slotIndex] = null;
        }
        this.items[slotIndex] = null;
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.container.setVisible(this.isOpen);
        
        if (this.scene.hotbar) {
            this.scene.hotbar.setVisible(this.isOpen);
        }
    }
}
