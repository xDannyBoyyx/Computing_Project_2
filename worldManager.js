// here i'll try and manager factors like time that should affect gameplay

// https://home.openweathermap.org/api_keys
// d67733d3cca63b07e935a9c72a8724fb

// will work on this more tomorrow
export class WorldManager {
    constructor(scene){
        this.scene = scene;

        // Returns as a string and makes it more difficult to split into hours, minutes, and seconds.
        // this.time = new Date().toLocaleTimeString();

        this.initialTime = new Date();
        this.time;

        this.realTime = false;

        this.hour = this.initialTime.getHours();
        this.min = this.initialTime.getMinutes();
        this.sec = this.initialTime.getSeconds();

        this.realTimeText = `${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`;
        this.gameTimeText = `${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`


        this.updateClock = this.updateClock.bind(this); // had to lock this = WorldManager rather than this = window because of setInterval

        this.currentWeather = "sunny"; // By default for now

        // Random weathers and their chances for now, will be used for procedural weather
        this.weatherTypes = [{type: "sunny", chance: 40},
                             {type: "cloudy", chance: 20},
                             {type: "windy", chance: 15},
                             {type: "rain", chance: 14},
                             {type: "snow", chance: 5},
                             {type: "storm", chance: 3},
                             {type: "dry heat", chance: 2},
                             {type: "blizzard", chance: 1}];

        this.weatherChange = false;

        this.weatherMode;
    }

    updateClock(){
        // ensuring its up to date
        this.time = new Date();
        
        // updating the text in UI to be real time
        if (this.realTime){
            this.hour = this.time.getHours();
            this.min = this.time.getMinutes();
            this.sec = this.time.getSeconds();
            
            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`);
        } else {
            this.min += 1;

            if (this.min >= 60){
                this.hour += 1;
                this.min = 0;
            }

            if (this.hour >= 24){
                this.hour = 0;
                this.min = 0;
            }

            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`);
        }

        // console.log(`${this.time} - ${this.initialTime} = ${this.time - this.initialTime}`);
    }

    updateWeatherState(){
        // if (this.weatherChange){
            const randomNum = Math.floor(Math.random() * 100) + 1; // Random number between 1-100
            var cumulativeChance = 0;

            for (let i = 0; i < this.weatherTypes.length; i++) {
                cumulativeChance += this.weatherTypes[i].chance;

                if (randomNum <= cumulativeChance) {
                    console.log(`Random: ${randomNum} cumulative: ${cumulativeChance} weather: ${this.weatherTypes[i].type}`);
                    this.currentWeather = this.weatherTypes[i].type;
                    break;
                }
            }

            // this.weatherChange = false;
        // }
    }

    fetchWeatherState(){ //for api
    }

    // using merchant example for now to understand where UI is
    createUI() {
        // displays top left
        if (this.realTime){
            this.timeText = this.scene.add.text(
                100, 20,                  
                this.realTimeText,      
                { fontSize: '18px', color: '#09006f', fontStyle: 'bold' }
            ).setOrigin(1, 0); 
        } else {
            this.timeText = this.scene.add.text(
                100, 20,                  
                this.gameTimeText,      
                { fontSize: '18px', color: '#09006f', fontStyle: 'bold' }
            ).setOrigin(1, 0); 
        }


        this.timeText.setScrollFactor(0); 
        this.timeText.setDepth(1000);    // above everything

        setInterval(this.updateClock, 1000); // Should update every second
    }

    update(time, delta){
        if (!this.realTime){
            if (this.time - this.initialTime >= 360000){ // for now 6 minutes / going to simulate 6 hours in game
                this.initialTime = this.time;
                this.updateWeatherState();
            }
        }
    }
}