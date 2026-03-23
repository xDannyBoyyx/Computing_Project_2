// API URL: https://home.openweathermap.org/api_keys
// API key: d67733d3cca63b07e935a9c72a8724fb

export class WorldManager {
    constructor(scene){
        this.scene = scene;

        // Returns as a string and makes it more difficult to split into hours, minutes, and seconds.
        // this.time = new Date().toLocaleTimeString();

        this.initialTime = new Date(); // Initialising and declaring real time for later use
        this.time; // Initialised for later use

        this.hour = this.initialTime.getHours();
        this.min = this.initialTime.getMinutes();
        this.sec = this.initialTime.getSeconds();

        // Depending on whether decides to use real world time or in game time, these are the two different type strings VVV
        this.realTimeText = `${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`;
        this.gameTimeText = `${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`

        this.updateClock = this.updateClock.bind(this); // Had to lock this = WorldManager rather than 'this = window' because of setInterval

        this.currentWeather = "sunny"; // Starting weather as default for now
        this.temperature;

        // Random weathers and their chances for now, will be used for procedural weather
        this.weatherTypes = [{type: "sunny", chance: 40},
                             {type: "cloudy", chance: 20},
                             {type: "windy", chance: 15},
                             {type: "rain", chance: 14},
                             {type: "snow", chance: 5},
                             {type: "storm", chance: 3},
                             {type: "dry heat", chance: 2},
                             {type: "blizzard", chance: 1}];

        this.weatherChange = false; // Intialised and declared for later use

        this.realTime = false; // Set as default for now
        this.realWeather = true; // Set as in game weather as default
    }

    updateClock(){
        // ensuring its up to date
        this.time = new Date();
        
        // updating the text in UI to be real time
        if (this.realTime){
            // If real time it'll simply gather the data and use it
            this.hour = this.time.getHours();
            this.min = this.time.getMinutes();
            this.sec = this.time.getSeconds();
            
            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`);
            // Displayed as HH:MM:SS
        } else {
            this.min += 1;

            // Just ensuring when it resets the times when minutes go 60 and hours over 24.
            if (this.min >= 60){
                this.hour += 1;
                this.min = 0;
            }

            if (this.hour >= 24){
                this.hour = 0;
                this.min = 0;
            }

            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`);
            // Displayed as HH:MM. HH = minutes, MM = seconds ^^^
        }
    }

    async fetchWeatherData(){ //for api
        try {
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=d67733d3cca63b07e935a9c72a8724fb');
            // The API URL and key above to access the data necessary ^

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // If by any means doesn't access the data due to error
            }

            const data = await response.json(); // Waiting to get the json data

            return {
                temperature: data.main.temp,       // The temp in celcius
                location: data.name,            // The location of where the weather data is, e.g. 'london'
                weatherType: data.weather[0].main // What the weather type is, i.e. "rain"
            }
            // console.log(`Temp: ${temperature} location: ${location} type: ${weatherType}`); // test to see data and whether it works
        } catch (error) {
            console.error('Error:', error); // checking if all of it went south and showcase error
        }
    }

    updateWeatherState(){
        if (this.realWeather){
            this.fetchWeatherData().then(weather => {
                console.log(`Temp: ${weather.temperature}°C location: ${weather.location} weather type: ${weather.weatherType}`); // Test to see if it access the data correctly from the API
                this.temperature = weather.temperature;
                // console.log(this.temperature);
            }).catch(error => console.error('Error updating weather:', error)); // If theres an error fetching then data then it'll showcase the error message
        } else {

            const randomNum = Math.floor(Math.random() * 100) + 1; // Random number between 1-100
            var cumulativeChance = 0; // Intialize to start

            for (let i = 0; i < this.weatherTypes.length; i++) { // Goes through how many weather types there are
                cumulativeChance += this.weatherTypes[i].chance; // Adds it all up

                if (randomNum <= cumulativeChance) { // Checks if random number fell into the chance of cumulative 
                    console.log(`Random: ${randomNum} cumulative: ${cumulativeChance} weather: ${this.weatherTypes[i].type}`); // Test to see if it works
                    this.currentWeather = this.weatherTypes[i].type; // Current weather is now the random generation
                    break; // Once it assigns variale, exit the loop
                }
            }
        }
    }

    // Used merchants function example but tweaked it to showcase time in other corner.
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
            // Everytime 6 minutes go by (6 hours in game), it'll update the weather state.
            if (this.time - this.initialTime >= 10000){ // for now 6 minutes (360000 ms) / going to simulate 6 hours in game
                this.initialTime = this.time;
                this.updateWeatherState();
            }
        }
    }
}