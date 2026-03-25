export class Merchant {
    constructor(scene) {
        this.scene = scene;
        // The main reason the hitboxes were all over the place was because I didn't have a static camera
       
        this.isOpen = false;

        this.container = this.scene.add.container(0, 0)
        .setDepth(1002)
        .setVisible(false);

    }

        initUI() {
        this.uiCamera = this.scene.cameras.add(
            0, 0,
            this.scene.scale.width,
            this.scene.scale.height
        );

        this.scene.cameras.main.ignore(this.container);

        // Items merchant sells (if you want to add to this, add the image under the preload function in game.js then come back here to format it)
        this.itemsForSale = [
            { key: 'Hoe', price: 50, displaySize: 21 },
            { key: 'WateringCan', price: 75, displaySize: 21 },
            { key: 'Axe', price: 20, displaySize: 21 },
            { key: 'Pickaxe', price: 40, displaySize: 21 },
            { key: 'Hammer', price: 30, displaySize: 21 },
            { key: 'Scythe', price: 60, displaySize: 21 },
            { key: 'Shovel', price: 25, displaySize: 21 },
            { key: 'wheatPouch', price: 30, displaySize: 21 },
            { key: 'carrotPouch', price: 25, displaySize: 21 },
            { key: 'raddishPouch', price: 35, displaySize: 21 },
            { key: 'cabbagePouch', price: 40, displaySize: 21 },
            { key: 'grapePouch', price: 45, displaySize: 21 },
            { key: 'chilliPouch', price: 50, displaySize: 21 },
            { key: 'cucumberPouch', price: 75, displaySize: 21 },
            { key: 'pineapplePouch', price: 100, displaySize: 21 },
            { key: 'pumpkinPouch', price: 200, displaySize: 21 },
            { key: 'climbBeansPouch', price: 300, displaySize: 21 },
        ];

        this.currentMode = 'buy';
        this.itemSlots = [];
        this.itemsPerPage = 10; // 2 rows × 5 columns
        this.currentPage = 0;

        this.createUI();
        this.setupInput();
    }

    createUI() {
        //Camera now fixed
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;

        this.panel = this.scene.add.rectangle(centerX, centerY, 440, 360, 0x2a2a2a)
            .setStrokeStyle(3, 0xffffff);
        this.container.add(this.panel);
        
        this.title = this.scene.add.text(centerX, centerY - 100, 'MERCHANT', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(this.title);

        const controlsY = this.panel.y + this.panel.height / 2 - 30;

        // Large invisible hitbox so I can debug
        this.modeButtonBG = this.scene.add.rectangle(centerX, controlsY - 18, 180, 30, 0x000000, 0) //change the last arguement into a 2 to see it
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.toggleMode());

        this.container.add(this.modeButtonBG);

        // Visible text
        this.modeIndicator = this.scene.add.text(centerX, controlsY - 22, 'BUY MODE', {
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#00ff00'
        }).setOrigin(0.5);

        this.container.add(this.modeIndicator);

        // prev or next butttons
        const prevHitbox = this.scene.add.rectangle(200, controlsY, 110, 40, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.prevPage());

        this.prevButton = this.scene.add.text(200, controlsY, '< Prev', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.container.add(prevHitbox);
        this.container.add(this.prevButton);

        const nextHitbox = this.scene.add.rectangle(440, controlsY, 110, 40, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.nextPage());

        this.nextButton = this.scene.add.text(440, controlsY, 'Next >', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.container.add(nextHitbox);
        this.container.add(this.nextButton);

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
        this.modeIndicator.setText(`${this.currentMode.toUpperCase()} MODE`);
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

    if (this.currentMode === 'sell') {
        let sellableItems = [];

        // Add items from inventory
        if (this.scene.inventory) {
            sellableItems.push(...this.scene.inventory.items
            .map((invItem, i) => {
                if (!invItem) return null;

                // Use the actual sprite from inventory, preserving frame if spritesheet
                const spriteKey = invItem.sprite.texture.key;
                const frame = invItem.sprite.frame ? invItem.sprite.frame.name : null;

                return {
                    type: invItem.type,
                    sprite: invItem.sprite,
                    frame: frame,          // for spritesheet crops
                    slotIndex: i,
                    source: 'inventory',
                    price: Math.floor(invItem.price / 2) || 10,
                    displaySize: invItem.displaySize || 21
                };
            }).filter(i => i));
        }

        // Add hotbar items
        if (this.scene.hotbar) {
            this.scene.hotbar.tools.forEach((tool, i) => {
                if (!tool) return;

                sellableItems.push({
                    type: tool.type,
                    sprite: tool.sprite,
                    slotIndex: i,
                    source: 'hotbar',
                    price: Math.floor(this.itemsForSale.find(x => x.key === tool.type)?.price / 2) || 10,
                    displaySize: tool.sprite.displayWidth || 20,
                    frame: tool.sprite.frame ? tool.sprite.frame.name : null
                });
            });
        }

        return sellableItems;
    }
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

        const startX = this.panel.x - 140;
        const startY = this.panel.y - 60;
        const slotSpacingX = 70;
        const slotSpacingY = 70;
        const slotSize = 55; 

        pageItems.forEach((item, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const x = startX + col * slotSpacingX;
        const y = startY + row * slotSpacingY;

        const slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x444444)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive();
        this.container.add(slot);

        
        let sprite;
        if (item.sprite && item.frame !== null) {
            // Item comes from inv or hotbar crop: uses same spritesheet and frame
            sprite = this.scene.add.sprite(x, y, item.sprite.texture.key, item.frame)
                .setDisplaySize(item.displaySize, item.displaySize);
        } else {
            
            sprite = this.scene.add.image(x, y, item.type || item.key)
                .setDisplaySize(item.displaySize, item.displaySize);
        }
        this.container.add(sprite);
       

        const priceText = this.scene.add.text(x, y + 28, `💰${item.price}`, {
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
    const hotbar = this.scene.hotbar;

    if (!economy || !inventory) return;
    if (!economy.spendGold(item.price)) return;

    // Fills hotbar if empty slot
    if (hotbar) {
        const emptyHotbarIndex = hotbar.tools.findIndex(t => !t);

        if (emptyHotbarIndex !== -1) {
            hotbar.addTool(item.key, emptyHotbarIndex, item.displaySize || 20);
            return; // stop here if placed
        }
    }

    // Fills inv once hotbar is filled
    const emptyIndex = inventory.items.findIndex(i => !i);
    if (emptyIndex === -1) return;

    // reserve slot
    inventory.items[emptyIndex] = { reserved: true };
    const slot = inventory.slots[emptyIndex];

    const itemSprite = this.scene.add.image(slot.x, slot.y, item.key)
        .setDisplaySize(21, 21)
        .setInteractive(
            new Phaser.Geom.Rectangle(-21, -21, 60, 60),
            Phaser.Geom.Rectangle.Contains
        );

    this.scene.input.setDraggable(itemSprite);
    itemSprite.source = 'inventory';
    itemSprite.slotIndex = emptyIndex;

    inventory.container.add(itemSprite);

    inventory.items[emptyIndex] = {
        type: item.key,
        sprite: itemSprite,
        price: item.price,
        displaySize: 21
    };
}
    
    // Will add to this later, the price to which an item is sold should be able to be influnced by various factors (crop quality, demand etc.)
    sellItem(item) {
        const economy = this.scene.economy;
        if (!economy || item.slotIndex === undefined) return;

        const sellPrice = Math.floor(item.price) || 10;
        economy.addGold(sellPrice);

        if (item.source === 'inventory' && this.scene.inventory) {
            if (this.scene.inventory.items[item.slotIndex]?.sprite) 
                this.scene.inventory.items[item.slotIndex].sprite.destroy();
            this.scene.inventory.items[item.slotIndex] = null;

        // Can now sell from hotbar as well
        } else if (item.source === 'hotbar' && this.scene.hotbar) {
            if (this.scene.hotbar.tools[item.slotIndex]?.sprite) 
                this.scene.hotbar.tools[item.slotIndex].sprite.destroy();
            this.scene.hotbar.tools[item.slotIndex] = null;
        }

        this.refreshItems();
    }

    update(time, delta) {
        if (!this.isOpen) return;
    }

}





