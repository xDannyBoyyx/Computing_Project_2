// Refactored to help implement my merchant and economy manager class

export class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.slots = [];
        this.items = new Array(30).fill(null); 
        
        this.createInventory();
        this.setupControls();
        this.setupDrag();
    }
    
    createInventory() {
        this.container = this.scene.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(500)
            .setVisible(false);
        
        let overlay = this.scene.add.rectangle(320, 180, 640, 360, 0x000000, 0.7);
        this.container.add(overlay);
        
        let panel = this.scene.add.rectangle(320, 180, 400, 250, 0x2a2a2a);
        panel.setStrokeStyle(3, 0xffffff);
        this.container.add(panel);
        
        let title = this.scene.add.text(320, 85, 'INVENTORY', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(title);
        
        
        // 30 slots (3 rows × 10 columns)

        const cols = 10;
        const rows = 3;

        const slotSize = 36;
        const spacing = 40;

        const gridWidth = (cols - 1) * spacing;
        const startX = 320 - gridWidth / 2;
        const startY = 120;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                let x = startX + col * spacing;
                let y = startY + row * spacing;

                let slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444)
                    .setStrokeStyle(2, 0x888888)
                    .setScrollFactor(0)
                    .setInteractive(
                        new Phaser.Geom.Rectangle(-30, -30, 60, 60),
                        Phaser.Geom.Rectangle.Contains
                    );

                slot.slotIndex = this.slots.length;

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

    // press I to open inventory
    setupControls() {
        this.scene.input.keyboard.on('keydown-I', () => this.toggle());
    }
    //Freezes the gameplay if UI is open
    toggle() {
        this.isOpen = !this.isOpen;
        this.container.setVisible(this.isOpen);
        
        this.scene.isUIOpen = this.isOpen;


        if (this.scene.hotbar) {
        this.scene.hotbar.setVisible(true); // hotbar is now always visible (encoutered a bug where it would disappear)
        this.scene.hotbar.setHighlighted?.(this.isOpen);
        

}
    }
setupDrag() {
    // Start dragging
    this.scene.input.on('dragstart', (pointer, gameObject) => {
        if (!this.isOpen) return;

        gameObject.dragStartX = pointer.x;
        gameObject.dragStartY = pointer.y;
        gameObject.wasDragged = false;

        
        this.scene.children.bringToTop(gameObject);
    });

    
    this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        if (!this.isOpen) return;

        if (Math.abs(pointer.x - gameObject.dragStartX) > 2 ||
            Math.abs(pointer.y - gameObject.dragStartY) > 2) {
            gameObject.wasDragged = true;
        }

        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    
    this.scene.input.on('dragend', (pointer, gameObject) => {
        if (!this.isOpen) return;

        const dropX = pointer.x;
        const dropY = pointer.y;
        let placed = false;

        
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            const bounds = slot.getBounds();

            if (Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) {

               
                if (gameObject.parentContainer) gameObject.parentContainer.remove(gameObject);

              
                this.container.add(gameObject);
                gameObject.x = slot.x;
                gameObject.y = slot.y;

                gameObject.setDisplaySize(21, 21);
                gameObject.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
                this.scene.input.setDraggable(gameObject);

                
                this.items[i] = { type: gameObject.texture.key, sprite: gameObject };

                
                if (gameObject.source === 'hotbar') {
                    this.scene.hotbar.tools[gameObject.slotIndex] = null;
                }

                gameObject.source = 'inventory';
                gameObject.slotIndex = i;

                placed = true;
                break;
            }
        }

       
        if (!placed && this.scene.hotbar) {
            placed = this.scene.hotbar.tryPlaceItem(gameObject, dropX, dropY, this);
        }

       
        if (!placed) {
            let slot;
            if (gameObject.source === 'hotbar') {
                slot = this.scene.hotbar.slots[gameObject.slotIndex];
            } else if (gameObject.source === 'inventory') {
                slot = this.slots[gameObject.slotIndex];
            }

            if (slot) {
                gameObject.x = slot.x;
                gameObject.y = slot.y;
            }
        }
    });
}


addItem(item, slot) {
    this.items[slot] = item;
}

removeItem(slot) {
    this.items[slot] = null;
}
} 