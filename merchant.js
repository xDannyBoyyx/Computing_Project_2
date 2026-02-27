export class Merchant {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;

        this.container = this.scene.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(1000)
            .setVisible(false);

        // Items merchant sells (if you want to add to this, add the image under the preload function in game.js then come back here to format it)
        this.itemsForSale = [
            { key: 'Hoe', price: 50, displaySize: 21 },
            { key: 'WateringCan', price: 75, displaySize: 21 },
            { key: 'Axe', price: 20, displaySize: 21 },
            { key: 'Pickaxe', price: 40, displaySize: 21 },
            { key: 'Hammer', price: 30, displaySize: 21 },
            { key: 'Scythe', price: 60, displaySize: 21 },
            { key: 'Shovel', price: 25, displaySize: 21 },
        ];

        this.currentMode = 'buy';
        this.itemSlots = [];
        this.itemsPerPage = 10; // 2 rows × 5 columns
        this.currentPage = 0;

        this.createUI();
        this.setupInput();
    }

    createUI() {
        
        this.panel = this.scene.add.rectangle(320, 180, 440, 360, 0x2a2a2a)
            .setStrokeStyle(3, 0xffffff);
        this.container.add(this.panel);

        
        this.title = this.scene.add.text(320, 80, 'MERCHANT', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);
        this.container.add(this.title);

        const controlsY = this.panel.y + this.panel.height / 2 - 30;

        // Mode indicator
        this.modeIndicator = this.scene.add.text(320, controlsY - 24, 'Mode: BUY', {
            fontSize: '18px', fontStyle: 'bold', color: '#00ff00'
        }).setOrigin(0.5);
        this.container.add(this.modeIndicator);

        // Should I just remove this? Thought it might help incase someone forgot they can just click buy to toggle between them
        this.modeButton = this.scene.add.text(320, controlsY, '[Toggle Buy/Sell]', {
            fontSize: '14px', color: '#00ffff'
        }).setInteractive().setOrigin(0.5).on('pointerdown', () => this.toggleMode());
        this.container.add(this.modeButton);

        // prev or next butttons
        this.prevButton = this.scene.add.text(200, controlsY, '< Prev', { fontSize: '16px', color: '#ffffff' })
            .setInteractive().setOrigin(0.5).on('pointerdown', () => this.prevPage());
        this.container.add(this.prevButton);

        this.nextButton = this.scene.add.text(440, controlsY, 'Next >', { fontSize: '16px', color: '#ffffff' })
            .setInteractive().setOrigin(0.5).on('pointerdown', () => this.nextPage());
        this.container.add(this.nextButton);

        // Close hint
        this.closeHint = this.scene.add.text(320, controlsY + 22, 'Press M to close', { fontSize: '14px', color: '#aaaaaa' })
            .setOrigin(0.5);
        this.container.add(this.closeHint);

        this.refreshItems();
    }

    setupInput() {
        this.scene.input.keyboard.on('keydown-M', () => this.toggle());
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.container.setVisible(this.isOpen);

        // Pause gameplay
        if (this.scene) {
            this.scene.isUIOpen = this.isOpen;
        }
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'buy' ? 'sell' : 'buy';
        this.modeIndicator.setText(`Mode: ${this.currentMode.toUpperCase()}`);
        this.modeIndicator.setColor(this.currentMode === 'buy' ? '#00ff00' : '#ff0000');
        this.currentPage = 0;
        this.refreshItems();
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.refreshItems();
        }
    }

    nextPage() {
        if ((this.currentPage + 1) * this.itemsPerPage < this.getCurrentItems().length) {
            this.currentPage++;
            this.refreshItems();
        }
    }

    getCurrentItems() {
        if (this.currentMode === 'buy') return this.itemsForSale;

        if (this.currentMode === 'sell' && this.scene.inventory) {
            return this.scene.inventory.items
                .map((invItem, i) => invItem ? {
                    type: invItem.type,
                    sprite: invItem.sprite,
                    slotIndex: i,
                    price: Math.floor(invItem.price / 2) || 10,
                    displaySize: 21
                } : null)
                .filter(i => i);
        }

        return [];
    }

    refreshItems() {
        // Destroy previous items
        this.itemSlots.forEach(slotData => {
            slotData.slot.destroy();
            slotData.sprite.destroy();
            slotData.priceText.destroy();
        });
        this.itemSlots = [];

        const items = this.getCurrentItems();
        const pageItems = items.slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);

        const startX = 180;
        const startY = 120;
        const slotSpacingX = 70;
        const slotSpacingY = 70;
        const slotSize = 50; 

        pageItems.forEach((item, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const x = startX + col * slotSpacingX;
            const y = startY + row * slotSpacingY;

            
            const slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive();
            this.container.add(slot);

            
            const sprite = this.scene.add.image(x, y, item.type || item.key)
                .setDisplaySize(item.displaySize, item.displaySize);
            this.container.add(sprite);

            const priceText = this.scene.add.text(x, y + 25, `💰${item.price}`, {
                fontSize: '14px', color: '#FFD700', fontStyle: 'bold'
            }).setOrigin(0.5, 0);
            this.container.add(priceText);

            this.itemSlots.push({ slot, sprite, priceText, item });

            slot.on('pointerdown', () => {
                if (this.currentMode === 'buy') this.buyItem(item);
                else this.sellItem(item);
            });
        });
    }

    buyItem(item) {
        const economy = this.scene.economy;
        const inventory = this.scene.inventory;
        if (!economy || !inventory) return;
        if (!economy.spendGold(item.price)) return;

        const emptyIndex = inventory.items.findIndex(i => !i);
        if (emptyIndex === -1) return;

        const slot = inventory.slots[emptyIndex];

        // Sprite always 21x21, so it's not oversized when moved to the hotbar
        const itemSprite = this.scene.add.image(slot.x, slot.y, item.key)
            .setDisplaySize(21, 21)
            .setInteractive({ draggable: true });

        itemSprite.source = 'inventory';
        itemSprite.slotIndex = emptyIndex;

        inventory.container.add(itemSprite);

        inventory.items[emptyIndex] = {
            type: item.key,
            sprite: itemSprite,
            price: item.price,
            displaySize: 21
        };

        
        this.scene.input.setDraggable(itemSprite);
        this.scene.input.on('dragend', (pointer, gameObject) => {
            if (!gameObject || gameObject.source !== 'inventory') return;

            const placed = this.scene.hotbar.tryPlaceItem(gameObject, pointer.worldX, pointer.worldY, inventory);

            if (!placed) {
                const origSlot = inventory.slots[gameObject.slotIndex];
                gameObject.x = origSlot.x;
                gameObject.y = origSlot.y;
            }
        });

        this.refreshItems();
    }

    // Will add to this later, the price to which an item is sold should be able to be influnced by various factors (crop quality, demand etc.)
    sellItem(item) {
        const economy = this.scene.economy;
        const inventory = this.scene.inventory;
        if (!economy || !inventory || item.slotIndex === undefined) return;

        const sellPrice = Math.floor(item.price / 2) || 10;
        economy.addGold(sellPrice);

        if (inventory.items[item.slotIndex]?.sprite) inventory.items[item.slotIndex].sprite.destroy();
        inventory.items[item.slotIndex] = null;

        this.refreshItems();
    }

    update(time, delta) {
        if (!this.isOpen) return;
    }
}