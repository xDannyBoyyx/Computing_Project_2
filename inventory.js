export class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.slots = [];
        this.items = new Array(30).fill(null); // 30 empty slots
        
        this.createInventory();
        this.setupControls();
    }
    
    createInventory() {
        // Container to hold everything
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(200);
        this.container.setVisible(false);
        
        let overlay = this.scene.add.rectangle(320, 180, 640, 360, 0x000000, 0.7);
        overlay.setScrollFactor(0);
        this.container.add(overlay);
        
        let panel = this.scene.add.rectangle(320, 180, 400, 250, 0x2a2a2a);
        panel.setStrokeStyle(3, 0xffffff);
        this.container.add(panel);
        
        let title = this.scene.add.text(320, 70, 'INVENTORY', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(title);
        
        // Creates 30 slots (3 rows, 10 columns)
        let startX = 135;
        let startY = 110;
        let slotSize = 32;
        let spacing = 37;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 10; col++) {
                let x = startX + (col * spacing);
                let y = startY + (row * spacing);
                
                let slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444);
                slot.setStrokeStyle(2, 0x888888);
                
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
        // Press I to open inventory
        this.scene.input.keyboard.on('keydown-I', () => {
            this.toggle();
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.container.setVisible(this.isOpen);
    }
    
    addItem(item, slot) {
        this.items[slot] = item;
    }
    
    removeItem(slot) {
        this.items[slot] = null;
    }
}
