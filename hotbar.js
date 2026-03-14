// Refactored completely as I needed to make the hotbar dynamic, while getting it to work with the inventory and other classes

export class Hotbar {
    constructor(scene) {
        this.scene = scene;
        this.selectedSlot = 0;

        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(600);

        this.slots = [];
        this.tools = [];

        this.createSlots();
        this.setupKeys();
        this.setupHoverEffects();
        this.blockClickThrough();

        // intial tools/sprites
        this.addTool('Hoe', 0);
        this.addTool('WateringCan', 1);
        
        // These don't do anything yet, just there to sell and purchase tools for the merchant class for now

        // do we technically need these for now or should at least be purchased and used later on?
        // Maybe its best if the player just starts with the hoe and watering can? -D
        this.addTool('Axe', 2);      
        this.addTool('Hammer', 3);   
        this.addTool('Pickaxe', 4);  
        this.addTool('Scythe', 5);   
        this.addTool('Shovel', 6);   
    }
    
    createSlots() {
        const slotCount = 10;

        for (let i = 0; i < slotCount; i++) {
            let x = 140 + i * 40;
            let y = 330;

            // Slot rectangle
            let slot = this.scene.add.rectangle(x, y, 32, 32, 0x444444)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0)
                .setInteractive({ useHandCursor: true });

            this.container.add(slot);
            this.slots.push(slot);

            slot.on('pointerdown', () => {
                this.selectSlot(i);
            });
            
            let label = i === 9 ? '0' : (i + 1).toString();
            let text = this.scene.add.text(x - 10, y - 10, label, { fontSize: '10px' })
                .setScrollFactor(0);
            this.container.add(text);
            
            this.tools.push(null);
        }

        this.highlightSlot();
    }

    setupHoverEffects() {
        // Track mouse movement to dim hotbar when hovering
        this.scene.input.on('pointermove', (pointer) => {
            const hotbarBounds = {
                x: 140 - 20,
                y: 330 - 20,
                width: 10 * 40 + 40,
                height: 60
            };
            
            // Check if pointer is over hotbar
            const isOverHotbar = pointer.x >= hotbarBounds.x && 
                               pointer.x <= hotbarBounds.x + hotbarBounds.width &&
                               pointer.y >= hotbarBounds.y && 
                               pointer.y <= hotbarBounds.y + hotbarBounds.height;
            
            // Dim hotbar when hovering over it
            if (isOverHotbar && !this.scene.isUIOpen) {
                this.container.setAlpha(0.3);
            } else {
                this.container.setAlpha(1);
            }
        });
    }

    blockClickThrough() {
    this.slots.forEach((slot) => {
        // Remove all existing pointerdown listeners
        slot.removeAllListeners('pointerdown');
        
        // Add new listener that stops propagation
        slot.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation(); // Stop click from going to farm manager
        });
    });
}

    addTool(toolKey, slotIndex, size = 20, offsetX = 0, offsetY = 0) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return;

        // removes sprite/tool if present
        if (this.tools[slotIndex]?.sprite) {
            this.tools[slotIndex].sprite.destroy();
            // Also destroy seed count text if it exists
            if (this.tools[slotIndex].seedCountText) {
                this.tools[slotIndex].seedCountText.destroy();
            }
        }
        
        let slot = this.slots[slotIndex];
        let toolImage = this.scene.add.image(slot.x + offsetX, slot.y + offsetY, toolKey)
            .setDisplaySize(size, size)
            .setScrollFactor(0)

            .setInteractive(
                new Phaser.Geom.Rectangle(-20, -20, 40, 40),
                Phaser.Geom.Rectangle.Contains
            );
            // Can now click on the hotbar instead of behind it
            toolImage.on('pointerdown', () => {
                this.selectSlot(slotIndex);
            });

        this.scene.input.setDraggable(toolImage);
        toolImage.slotIndex = slotIndex;
        toolImage.source = 'hotbar';

        this.container.add(toolImage);
        
        // Check if it's a pouch and add seed count
        let seedCountText = null;
        let seedCount = null;
        
        if (toolKey.includes('Pouch')) {
            seedCount = 5; // Start with 5 seeds
            seedCountText = this.scene.add.text(slot.x + 10, slot.y + 10, seedCount.toString(), {
                fontSize: '12px',
                color: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#000000'
            }).setOrigin(0.5).setScrollFactor(0);
            
            this.container.add(seedCountText);
        }
        
        this.tools[slotIndex] = { 
            type: toolKey, 
            sprite: toolImage,
            seedCount: seedCount,
            seedCountText: seedCountText
        };
    }

    useSeed(slotIndex) {
        const tool = this.tools[slotIndex];
        
        if (!tool || !tool.seedCount) return true; // Not a pouch, allow planting
        
        tool.seedCount--;
        
        if (tool.seedCountText) {
            tool.seedCountText.setText(tool.seedCount.toString());
        }
        
        // If no seeds left, remove the pouch
        if (tool.seedCount <= 0) {
            if (tool.sprite) tool.sprite.destroy();
            if (tool.seedCountText) tool.seedCountText.destroy();
            this.tools[slotIndex] = null;
            return false; // No more seeds
        }
        
        return true; // Still has seeds
    }

    highlightSlot() {
        for (let i = 0; i < 10; i++) {
            this.slots[i].setStrokeStyle(2, 0xffffff);
        }
        this.slots[this.selectedSlot].setStrokeStyle(3, 0xffff00);
    }

    tryPlaceItem(gameObject, dropX, dropY, inventoryRef) {
        let placed = false;

        this.slots.forEach((slot, index) => {
            if (placed) return;

            const bounds = slot.getBounds();
            if (!Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) return;

            const oldIndex = gameObject.slotIndex;
            const targetTool = this.tools[index];
            
            if (gameObject.source === 'inventory') {
                inventoryRef.items[oldIndex] = null;
            } else if (gameObject.source === 'hotbar') {
                this.tools[oldIndex] = null;
            }

            if (gameObject.parentContainer) gameObject.parentContainer.remove(gameObject);
            this.container.add(gameObject);

            // Swap
            if (targetTool && targetTool.sprite !== gameObject) {

                const other = targetTool.sprite;

                // inv/hotbar swap
                if (gameObject.source === 'inventory') {

                    // move hotbar item to inventory
                    if (other.parentContainer) other.parentContainer.remove(other);
                    inventoryRef.container.add(other);

                    const invSlot = inventoryRef.slots[oldIndex];

                    this.scene.tweens.add({
                        targets: other,
                        x: invSlot.x,
                        y: invSlot.y,
                        duration: 120
                    });

                    inventoryRef.items[oldIndex] = {
                        type: other.texture.key,
                        sprite: other
                    };

                    other.source = 'inventory';
                    other.slotIndex = oldIndex;
                    
                    this.tools[index] = { type: gameObject.texture.key, sprite: gameObject };

                    gameObject.slotIndex = index;

                    this.scene.tweens.add({
                        targets: gameObject,
                        x: this.slots[index].x,
                        y: this.slots[index].y,
                        duration: 120
                    });
                }

                //  hotbar/hotbar swap
                else {

                    this.tools[index] = { type: gameObject.texture.key, sprite: gameObject };
                    this.tools[oldIndex] = targetTool;

                    gameObject.slotIndex = index;
                    other.slotIndex = oldIndex;

                    this.scene.tweens.add({
                        targets: gameObject,
                        x: this.slots[index].x,
                        y: this.slots[index].y,
                        duration: 120
                    });

                    this.scene.tweens.add({
                        targets: other,
                        x: this.slots[oldIndex].x,
                        y: this.slots[oldIndex].y,
                        duration: 120
                    });
                }
            }
            
            else {
                this.tools[index] = { type: gameObject.texture.key, sprite: gameObject };

                gameObject.slotIndex = index;

                gameObject.x = slot.x;
                gameObject.y = slot.y;
            }

            gameObject.source = 'hotbar';

            gameObject.setDisplaySize(20,20)
            .setInteractive(
                new Phaser.Geom.Rectangle(-20,-20,40,40),
                Phaser.Geom.Rectangle.Contains
            );

            this.scene.input.setDraggable(gameObject);

            gameObject.removeAllListeners('pointerdown');
            gameObject.on('pointerdown', () => this.selectSlot(index));

            placed = true;
        });

    return placed;
    }

    setupKeys() {
        const keys = ['ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','ZERO'];
        keys.forEach((key, index) => {
            this.scene.input.keyboard.on('keydown-' + key, () => this.selectSlot(index));
        });
    }

    selectSlot(slotNumber) {
        this.selectedSlot = slotNumber;
        this.highlightSlot();
    }

    setVisible(visible) {
        this.container.setVisible(visible);
        this.container.iterate(child => {
            if (child.input) child.input.enabled = visible;
        });
    }

    getSelectedTool() {
        return this.tools[this.selectedSlot];
    }
}
