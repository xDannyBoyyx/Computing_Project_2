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
        
        let overlay = this.scene.add.rectangle(320, 180, 640, 360, 0x000000, 0.7)
            .setScrollFactor(0)
            .setDepth(-1); // make sure it doesn't block input
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

                // visual slot
                let slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444)
                    .setStrokeStyle(2, 0x888888)
                    .setScrollFactor(0);

                // invisible hitbox
                let hitbox = this.scene.add.rectangle(x, y, 60, 60, 0x000000, 0)
                    .setScrollFactor(0)
                    .setInteractive({ useHandCursor: true });

                hitbox.slotIndex = this.slots.length;

                this.container.add(slot);
                this.container.add(hitbox);

                this.slots.push(hitbox);
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

    // Freezes the gameplay if UI is open
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

        // Bring dragged object to top
        this.scene.children.bringToTop(gameObject);
    });

    // While dragging
    this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        if (!this.isOpen) return;

        if (Math.abs(pointer.x - gameObject.dragStartX) > 2 ||
            Math.abs(pointer.y - gameObject.dragStartY) > 2) {
            gameObject.wasDragged = true;
        }

        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    // On drag end
    this.scene.input.on('dragend', (pointer, gameObject) => {
    if (!this.isOpen) return;

    const dropX = pointer.x;
    const dropY = pointer.y;
    let placed = false;

    for (let i = 0; i < this.slots.length; i++) {
        const slot = this.slots[i];
        const bounds = slot.getBounds();

        if (!Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) continue;

        const oldIndex = gameObject.slotIndex;
        const targetItem = this.items[i];

        // Remove from old location
        if (gameObject.source === 'inventory') {
            this.items[oldIndex] = null;
        } else if (gameObject.source === 'hotbar' && this.scene.hotbar) {
            this.scene.hotbar.tools[oldIndex] = null;
        }

        if (gameObject.parentContainer) gameObject.parentContainer.remove(gameObject);
        this.container.add(gameObject);

        // s
        if (targetItem && targetItem.sprite !== gameObject) {
            const other = targetItem.sprite;

            // Move existing item to old slot
            if (other.parentContainer) other.parentContainer.remove(other);
            this.container.add(other);

            const oldSlot = this.slots[oldIndex];

            this.scene.tweens.add({
                targets: other,
                x: oldSlot.x,
                y: oldSlot.y,
                duration: 120
            });

            // Preserve frame
            if (other.harvestedFrame !== undefined) {
                other.setFrame(other.harvestedFrame);
            }

            this.items[oldIndex] = {
                type: other.texture.key,
                sprite: other,
                frame: other.harvestedFrame,
                harvestedFrame: other.harvestedFrame,
                displaySize: 21,
                source: 'inventory',
                slotIndex: oldIndex,
                price: other.price || 10
            };

            other.source = 'inventory';
            other.slotIndex = oldIndex;
        }

        // Place dragged item in new slot
        this.items[i] = {
            type: gameObject.texture.key,
            sprite: gameObject,
            frame: gameObject.harvestedFrame,
            harvestedFrame: gameObject.harvestedFrame,
            displaySize: 21,
            source: 'inventory',
            slotIndex: i,
            price: gameObject.price || 10
        };

        gameObject.x = slot.x;
        gameObject.y = slot.y;

        if (gameObject.harvestedFrame !== undefined) {
            gameObject.setFrame(gameObject.harvestedFrame);
        }

        gameObject.setDisplaySize(21, 21);
        gameObject.setInteractive(
            new Phaser.Geom.Rectangle(-30, -30, 60, 60),
            Phaser.Geom.Rectangle.Contains
        );

        this.scene.input.setDraggable(gameObject);

        gameObject.source = 'inventory';
        gameObject.slotIndex = i;

        placed = true;
        break;
    }

    // Try hotbar if not placed
    if (!placed && this.scene.hotbar) {
        placed = this.scene.hotbar.tryPlaceItem(gameObject, dropX, dropY, this);
    }

    // Return if nowhere placed
    if (!placed) {
        let slot;
        if (gameObject.source === 'hotbar') {
            slot = this.scene.hotbar.slots[gameObject.slotIndex];
        } else {
            slot = this.slots[gameObject.slotIndex];
        }

        if (slot) {
            gameObject.x = slot.x;
            gameObject.y = slot.y;
        }
    }
});
}

    // Add item to inventory (keeps frame if from spritesheet)
    addItem(item, slot) {
        const { type, frame } = item;
        const sprite = this.scene.add.sprite(this.slots[slot].x, this.slots[slot].y, type, frame)
            .setDisplaySize(21, 21)
            .setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);

        this.scene.input.setDraggable(sprite);
        sprite.source = 'inventory';
        sprite.slotIndex = slot;

        this.items[slot] = { type, sprite, frame };
    }

    removeItem(slot) {
        if (this.items[slot]?.sprite) this.items[slot].sprite.destroy();
        this.items[slot] = null;
    }
}