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

        // intial tools/sprites
        this.addTool('Hoe', 0);
        this.addTool('WateringCan', 1, 15, 4);
        
     

        // These don't do anything yet, just there to sell and purchase tools for the merchant class for now
        this.addTool('Axe', 2);      
        this.addTool('Hammer', 3);   
        this.addTool('Pickaxe', 4);  
        this.addTool('Scythe', 5);   
        this.addTool('Shovel', 6);
        
        
    }
    
  
    createSlots() {
        const slotCount = 10;

        for (let i = 0; i < slotCount; i++) {
            let x = 190 + i * 28;
            let y = 330;

            // Slot rectangle
            let slot = this.scene.add.rectangle(x, y, 24, 24, 0x444444)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0);
            this.container.add(slot);
            this.slots.push(slot);

            
            let label = i === 9 ? '0' : (i + 1).toString();
            let text = this.scene.add.text(x - 10, y - 10, label, { fontSize: '10px' })
                .setScrollFactor(0);
            this.container.add(text);

            
            this.tools.push(null);
        }

        this.highlightSlot();
    }

    addTool(toolKey, slotIndex, size = 20, offsetX = 0, offsetY = 0) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return;

        // removes sprite/tool if present
        if (this.tools[slotIndex]?.sprite) {
            this.tools[slotIndex].sprite.destroy();
        }
        
        // Don't have to add a tool here each time I want to do something, can now just drag it from inv
        let slot = this.slots[slotIndex];
        let toolImage = this.scene.add.image(slot.x + offsetX, slot.y + offsetY, toolKey)
            .setDisplaySize(size, size)
            .setScrollFactor(0)
            .setInteractive({ draggable: true });

        this.scene.input.setDraggable(toolImage);
        toolImage.slotIndex = slotIndex;
        toolImage.source = 'hotbar';

        this.container.add(toolImage);
        this.tools[slotIndex] = { type: toolKey, sprite: toolImage };
    }

    highlightSlot() {
        for (let i = 0; i < this.slots.length; i++) {
            this.slots[i].setStrokeStyle(2, 0xffffff);
        }
        this.slots[this.selectedSlot].setStrokeStyle(3, 0xffff00);
    }

    // Moving items back from inv into hotbar
    tryPlaceItem(gameObject, dropX, dropY, inventoryRef) {
    let placed = false;

    this.slots.forEach((slot, index) => {
        if (placed) return;

        const bounds = slot.getBounds();

        if (Phaser.Geom.Rectangle.Contains(bounds, dropX, dropY)) {

            
            if (gameObject.source === 'inventory') {
                inventoryRef.items[gameObject.slotIndex] = null;
            }

           
            if (this.tools[index]?.sprite) {
                this.tools[index].sprite.destroy();
            }

            
            this.container.add(gameObject);
            gameObject.x = slot.x;
            gameObject.y = slot.y;

         
            this.tools[index] = {
                type: gameObject.texture.key,
                sprite: gameObject
            };

            
            gameObject.source = 'hotbar';
            gameObject.slotIndex = index;

            placed = true;
        }
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