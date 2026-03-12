// here i'll try and manager factors like time that should affect gameplay

// will work on this more tomorrow
export class WorldManager {
    constructor(scene){
        this.scene = scene;

        // Returns as a string and makes it more difficult to split into hours, minutes, and seconds.
        // this.time = new Date().toLocaleTimeString();

        this.time = new Date();
        this.hour = this.time.getHours();
        this.min = this.time.getMinutes();
        this.sec = this.time.getSeconds();

        this.updateClock = this.updateClock.bind(this); // had to lock this = WorldManager rather than this = window because of setInterval
    }

    // using merchant example for now to understand where UI is
    createUI() {
        // displays top left
        this.timeText = this.scene.add.text(
            100, 20,                  
            `${this.hour}:${this.min}:${this.sec}`,      
            { fontSize: '18px', color: '#09006f', fontStyle: 'bold' }
        ).setOrigin(1, 0);

        this.timeText.setScrollFactor(0); 
        this.timeText.setDepth(1000);    // above everything

        setInterval(this.updateClock, 1000); // Should update every second
    }

    update(time, delta){
    }

    updateClock(){
        // ensuring its up to date
        this.time = new Date();
        this.hour = this.time.getHours();
        this.min = this.time.getMinutes();
        this.sec = this.time.getSeconds();
        
        // updating the text in UI to be real time
        this.timeText.setText(`${this.hour}:${this.min}:${this.sec}`);
    }
}