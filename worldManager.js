// Open source free (as long as it isn't abused) API used to gain information about real weather in real time
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
        this.realWeather = false; // Set as in game weather as default

        // Used to alter the growth of the plants/crops, set to 0.8 by default as current weather is sunny by default
        this.growthModifier = 0.8;

        // this.growthTxt = `Default`;
        this.growthTxt = `+${Math.floor((1 - this.growthModifier) * 100) + 1}%`;
        this.weatherTipText = `Weather: ${this.currentWeather.charAt(0).toUpperCase() + this.currentWeather.slice(1)}\nCrop growth: ${this.growthTxt}`;
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
            
            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}:${this.sec.toString().padStart(2, '0')}`);
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
                temperature: data.main.temp,  // The temp in celcius
                location: data.name,  // The location of where the weather data is, e.g. 'london'
                weatherType: data.weather[0].main  // What the weather type is, i.e. "rain"
            }
            // console.log(`Temp: ${temperature} location: ${location} type: ${weatherType}`); // test to see data and whether it works
        } catch (error) {
            console.error('Error:', error); // checking if all of it went south and showcase error
        }
    }

    updateWeatherState(){
        // If the setting is to use real weather then it'll gather data from the API and assign them to variables for later use
        if (this.realWeather){
            this.fetchWeatherData().then(weather => {
                // Test to see if it access the data correctly from the API
                // console.log(`Temp: ${weather.temperature}°C location: ${weather.location} weather type: ${weather.weatherType}`); 

                // Assigning data from API to variables
                this.temperature = weather.temperature;
                this.currentWeather = weather.weatherType;
            }).catch(error => console.error('Error updating weather:', error)); // If theres an error fetching then data then it'll showcase the error message
        } 

        // If its in game weather then its using simple randomify logic to change the weather type and assign it for later use
        else {
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

     // Depending on whether its real or in game weather, it'll affect the growth modifier which then speeds up or slows down the growth of the plant
    reactToWeather(){
        if (this.realWeather){
            if (this.temperature < 15 || this.temperature > 25){
                this.growthModifier = 1.5; // Making it take slightly longer for plants to grow because of temperatures
            } else { 
                this.growthModifier = 0.8;
            }

            // check the certain api names for rain and snow!!!
        } else {
            // Checking in game weathers and changing the growth modifiers based on what the random weather chosen was.
            switch (this.currentWeather){
                case "sunny":
                    this.growthModifier = 0.8
                break;
                case "cloudy":
                    this.growthModifier = 1.05;
                break
                case "windy":
                    this.growthModifier = 1.2
                break;
                case "rain":
                    this.growthModifier = 0.9;
                    // watered tile
                break;
                case "snow":
                    this.growthModifier = 1.3;
                    // watered tile
                break;
                case "storm":
                    this.growthModifier = 1.5;
                    // watered tile
                break;
                case "dry heat":
                    this.growthModifier = 1.8;
                    // dry any watered tiles
                break;
                case "blizzard":
                    this.growthModifier = 2.0;
                    // watered tile
                break;

                default:
                    this.growthModifier = 1.0;
            }
        }

        // Text showing modifier in simpler terms (i.e. +20% boost or -30% decrease boost for crop growth depending on weather)
        if (this.growthModifier > 1){
            this.growthTxt = `-${Math.floor((this.growthModifier - 1) * 100)}%`;
        } else {
            this.growthTxt = `+${Math.floor((1 - this.growthModifier) * 100) + 1}%`;
        }

        // Updating the weather UI to showcase correct weather icon and tip information
        // console.log(this.currentWeather);
        this.weatherIcon.setTexture(this.currentWeather);
        this.weatherTip.setText(`Weather: ${this.currentWeather.charAt(0).toUpperCase() + this.currentWeather.slice(1)}\nCrop growth: ${this.growthTxt}`);
    }

    // Used merchants function example but tweaked it to showcase time in other corner.
    createUI() {
        // displays top left
        if (this.realTime){
            var clock = this.scene.add.image(112, 11, "timeBG").setOrigin(1, 0);
            clock.displayWidth = 110;

            this.timeText = this.scene.add.text(
                100, 20,                  
                this.realTimeText,      
                { fontSize: '18px', color: '#09006f', fontStyle: 'bold' }
            ).setOrigin(1, 0); 
        } else {
            var clock = this.scene.add.image(84, 11, "timeBG").setOrigin(1, 0);

            this.timeText = this.scene.add.text(
                80, 20,                  
                this.gameTimeText,      
                { fontSize: '18px', color: '#695349', fontStyle: 'bold' }
            ).setOrigin(1, 0); 
        }

        // creating the weather icon and making it interactive so users can view the effects it has on their crops
        this.weatherIcon = this.scene.add.image(150, 11, this.currentWeather).setOrigin(1, 0).setInteractive({cursor: 'pointer'});

        // Create tooltip (hidden by default)
        this.weatherTip = this.scene.add.text(
            290, 11,
            // Just to make it look prettier with a capital first letter (basic vanilla js)
            this.weatherTipText,
            { fontSize: '10px', color: '#a8ae98', backgroundColor: '#000',  padding: { x: 5, y: 2 }}
            ).setOrigin(1, 0).setVisible(false);

        this.weatherTip.setFixedSize(130,30);

        // Shows the weather tip once hovering over the image
        this.weatherIcon.on('pointerover', () => {
            this.weatherTip.setVisible(true);
        });

        // And then hiding the tip again once the mouse is away from the image
        this.weatherIcon.on('pointerout', () => {
            this.weatherTip.setVisible(false);
        });   

        this.timeText.setScrollFactor(0); 
        this.timeText.setDepth(10000);    // Above everything

        setInterval(this.updateClock, 1000); // Should ensure the clock updates every second
    }

    update(time, delta){
        if (!this.realTime){
            // Everytime 6 minutes go by (6 hours in game), it'll update the weather state.
            if (this.time - this.initialTime >= 10000){ // for now 6 minutes (360000 ms) / going to simulate 6 hours in game
                this.initialTime = this.time;
                this.updateWeatherState();
                this.reactToWeather();
            }
        }
    }
}