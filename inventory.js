// Refactored to help implement my merchant and economy manager class

export class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.slots = [];
        this.items = new Array(30).fill(null); // 30 empty slots
        
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
        let startX = 155;
        let startY = 120;
        let slotSize = 32;
        let spacing = 37;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 10; col++) {
                let x = startX + (col * spacing);
                let y = startY + (row * spacing);
                
                let slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444)
                    .setStrokeStyle(2, 0x888888)
                    .setScrollFactor(0)
                    .setInteractive();
                
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

    this.scene.input.on('dragstart', (pointer, gameObject) => {

        // prevents dragging if inv is not open
        if (!this.isOpen) return;

        this.scene.children.bringToTop(gameObject);
    });

    this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {

        
        if (!this.isOpen) return;

        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.scene.input.on('dragend', (pointer, gameObject) => {
    if (!this.isOpen) return;

    let placed = false;

    // Uses screen instead of world coordinates, saved me a lot of hassle
    const dropX = pointer.x;
    const dropY = pointer.y;

    // Handle inventory slots
    this.slots.forEach((slot, index) => {
        if (placed) return;

        const bounds = slot.getBounds(); 
        if (Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) {

            
            this.container.add(gameObject);
            gameObject.x = slot.x;
            gameObject.y = slot.y;

            
            this.items[index] = {
                type: gameObject.texture.key,
                sprite: gameObject
            };

            
            if (gameObject.source === 'hotbar') {
                this.scene.hotbar.tools[gameObject.slotIndex] = null;
            }

           
            gameObject.source = 'inventory';
            gameObject.slotIndex = index;

            placed = true;
        }
    });
        

        
        if (!placed && this.scene.hotbar) {
            placed = this.scene.hotbar.tryPlaceItem(
                gameObject,
                dropX,
                dropY,
                this   
            );
        }m

        
        if (!placed) {
            if (gameObject.source === 'hotbar') {
                const slot = this.scene.hotbar.slots[gameObject.slotIndex];
                gameObject.x = slot.x;
                gameObject.y = slot.y;
            }

            if (gameObject.source === 'inventory') {
                const slot = this.slots[gameObject.slotIndex];
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