// here i'll try and manager factors like time that should affect gameplay

// will work on this more tomorrow
export class WorldManager {
    constructor(scene){
        this.scene = scene;
        this.time = new Date().toLocaleTimeString();
        this.updateClock = this.updateClock.bind(this); // had to lock this = WorldManager rather than this = window because of setInterval
    }

    // using merchant example for now to understand where UI is
    createUI() {
        // displays top left
        this.timeText = this.scene.add.text(
            100, 20,                  
            this.time,      
            { fontSize: '18px', color: '#09006f', fontStyle: 'bold' }
        ).setOrigin(1, 0);

        this.timeText.setScrollFactor(0); 
        this.timeText.setDepth(1000);    // above everything

        setInterval(this.updateClock, 1000); // Should update every second
    }

    update(time, delta){
    }

    updateClock(){
         this.time = new Date().toLocaleTimeString();
         this.timeText.setText(this.time);
    }
}