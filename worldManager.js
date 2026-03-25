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

        // Creating an overlay over the whole screen which will be altered later to set tints based on time (e.g. dawn, dusk, night, etc.).
        this.overlay = this.scene.add.graphics();

        this.currentWeather = "clear"; // Starting weather as default for now
        this.temperature; // Initalized for later use

        // Random weathers and their chances for now, will be used for procedural weather
        this.weatherTypes = [{type: "clear", chance: 40},
                             {type: "cloudy", chance: 20},
                             {type: "windy", chance: 15},
                             {type: "rain", chance: 14},
                             {type: "snow", chance: 5},
                             {type: "storm", chance: 3},
                             {type: "dry heat", chance: 2},
                             {type: "blizzard", chance: 1}];

        this.weatherChange = false; // Intialised and declared for later use

        this.realTime = true; // Set as default for now
        this.realWeather = false; // Set as in game weather as default

        this.updateTimeDuration = 360000; // 6 minutes, in game time update as default for now
        if (this.realTime) this.updateTimeDuration = 21600000; // 6 hours, used for real world update simulation

        // Used to alter the growth of the plants/crops, set to 1.2 by default as current weather is clear by default
        this.growthModifier = 1.2;

        // this.growthTxt = `Default`;
        this.growthTxt = `+${Math.round((this.growthModifier - 1) * 100)}%`;
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
            
            // Displayed as HH:MM:SS
            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}:${this.sec.toString().padStart(2, '0')}`);

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

            // Displayed as HH:MM. HH = minutes, MM = seconds
            this.timeText.setText(`${this.hour.toString().padStart(2, '0')}:${this.min.toString().padStart(2, '0')}`);
        }

        // Change this value to test tints
        // this.hour = 22;

        // Creating the visual aspect of time, depending on the hour in game or real life will then apply different tints to the screen
        if ((this.hour >= 5 && this.hour < 7) || (this.hour >= 17 && this.hour < 20)) {
            // Dawn or dusk, slightly orange
            this.overlay.clear();
            this.overlay.fillStyle(0xffa500, 0.25);
            this.overlay.fillRect(0, 0, 640, 360);
            this.overlay.setDepth(500);   
        } else if (this.hour < 5 || this.hour >= 20) {
            // Night, making screen darker
            this.overlay.clear();
            this.overlay.fillStyle(0x00008b, 0.5);
            this.overlay.fillRect(0, 0, 640, 360);
            this.overlay.setDepth(500);   
        } else {
            // Day, just removed the tint to keep it natural
            this.overlay.clear();
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
                console.log(`Weather: ${this.currentWeather} temperature: ${this.temperature}°C`)
            }).catch(error => console.error('Error updating weather:', error)); // If theres an error fetching then data then it'll showcase the error message
        } 

        // If its in game weather then its using simple randomify logic to change the weather type and assign it for later use
        else {
            const randomNum = Math.round(Math.random() * 100); // Random number between 1-100
            var cumulativeChance = 0; // Intialize to start

            for (let i = 0; i < this.weatherTypes.length; i++) { // Goes through how many weather types there are
                cumulativeChance += this.weatherTypes[i].chance; // Adds it all up

                if (randomNum <= cumulativeChance) { // Checks if random number fell into the chance of cumulative 
                    console.log(`Random weather chosen: ${this.weatherTypes[i].type} with random number: ${randomNum} falling between: ${cumulativeChance - this.weatherTypes[i].chance}-${cumulativeChance}`); // Test to see if it works
                    this.currentWeather = this.weatherTypes[i].type; // Current weather is now the random generation
                    break; // Once it assigns variale, exit the loop
                }
            }
        }
    }

     // Depending on whether its real or in game weather, it'll affect the growth modifier which then speeds up or slows down the growth of the plant
    reactToWeather(){
        // check the certain api names for rain and snow!!! check their names and assign it to the variables and images used.
        // Checking in game weathers and changing the growth modifiers based on what the random weather chosen was.
        switch (this.currentWeather.toLowerCase()){
            // IG & RL
            case "clear":
                this.growthModifier = 1.2;
                this.weatherIcon.setTexture("sunny");

                // If its around night time, used the moon instead of sun icon and slowly decrease crop growth boost
                if (this.hour < 5 || this.hour >= 20) {
                    this.growthModifier = 1.1;
                    this.weatherIcon.setTexture("night");
                }
            break;

            // IG
            case "cloudy":
            // RL
            case "clouds":
            case "haze":
            case "mist":
            case "fog":
                this.growthModifier = 0.9;
                this.weatherIcon.setTexture("cloudy");
            break

            // IG
            case "windy":
                this.growthModifier = 0.8
                this.weatherIcon.setTexture("windy");
            break;

            // IG & RL
            case "rain":
            // RL
            case "drizzle":
                this.growthModifier = 0.85;
                this.weatherIcon.setTexture("rain");
                // watered tile
            break;

            // IG & RL
            case "snow":
                this.growthModifier = 0.7;
                this.weatherIcon.setTexture("snow");
                // watered tile
            break;

            // IG
            case "storm":
            // RL
            case "thunderstorm":
            case "squall":
                this.growthModifier = 0.5;
                this.weatherIcon.setTexture("storm");
                // watered tile
            break;

            // IG
            case "dry heat":
                this.growthModifier = 0.35;
                this.weatherIcon.setTexture("dry heat");
                // dry any watered tiles
            break;

            // IG
            case "blizzard":
                this.growthModifier = 0.3;
                this.weatherIcon.setTexture("blizzard");
                // watered tile
            break;

            default:
                this.growthModifier = 1.2;
                this.weatherIcon.setTexture("sunny");

                // If its around night time, used the moon instead of sun icon and slowly decrease crop growth boost
                if (this.hour < 5 || this.hour >= 20) {
                    this.growthModifier = 1.1;
                    this.weatherIcon.setTexture("night");
                }
        }

        this.tempText = "";
        this.harshTemp = false; // Used to ensure growth modifier isn't altered every time reactToWeather() is called (e.g. +.3 +.3, -.3 -.3) 

        // If the game is checking for real weather then it'll check for an in between of cold and hot temperatures
        // if it is too cold or too hot, it'll slow growth down and add to the text displayed when hovering over the weather icon
        if (this.realWeather){
            if ((this.temperature < 15 || this.temperature > 25) && !this.harshTemp){
                this.growthModifier -= .2; 
                this.weatherTip.setFixedSize(130,40); // Increasing space for the temp text
                this.tempText = `\nTemperature: ${this.temperature}°C!`;
                this.harshTemp = true;
            } else {
                if ((this.temperature >= 15 && this.temperature <= 25) && this.harshTemp){
                    this.growthModifier += .2;
                    this.weatherTip.setFixedSize(130,30); // Decreasing it again as it's not shown
                    this.tempText = ``;
                    this.harshTemp = false;
                }
            }
        }

        // Text showing modifier in simpler terms (i.e. +20% boost or -30% decrease boost for crop growth depending on weather and/or temperature)
        if (this.growthModifier > 1) this.growthTxt = `+${Math.round((this.growthModifier - 1) * 100)}%`;
        else this.growthTxt = `-${Math.round((1 - this.growthModifier) * 100)}%`;

        // Updating weather tip information after growth modifier text has been configured from both weather type and temperature
        if (this.realWeather) this.weatherTip.setText(`Weather: ${this.currentWeather.charAt(0).toUpperCase() + this.currentWeather.slice(1)}${this.tempText}\nCrop growth: ${this.growthTxt}`);
        else this.weatherTip.setText(`Weather: ${this.currentWeather.charAt(0).toUpperCase() + this.currentWeather.slice(1)}\nCrop growth: ${this.growthTxt}`); 
        // If player decides to stick with in game weather, temperature will be removed to keep it simple ^
    }

    // Used merchants function example but tweaked it to showcase time in other corner.
    createUI() {
        // displays top left
        if (this.realTime){
            // Simple background made for the clock
            this.clock = this.scene.add.image(112, 11, "timeBG").setOrigin(1, 0);
            this.clock.displayWidth = 110; // Stretch the image for real time
            this.clock.setDepth(1100);

            this.timeText = this.scene.add.text(
                100, 20,                  
                this.realTimeText,      
                { fontSize: '18px', color: '#695349', fontStyle: 'bold' }
            ).setOrigin(1, 0); 
        } else {
            this.clock = this.scene.add.image(84, 11, "timeBG").setOrigin(1, 0);
            this.clock.setDepth(1100)

            this.timeText = this.scene.add.text(
                80, 20,                  
                this.gameTimeText,      
                { fontSize: '18px', color: '#695349', fontStyle: 'bold' }
            ).setOrigin(1, 0); 
        }

        // creating the weather icon and making it interactive so users can view the effects it has on their crops
        this.weatherIcon = this.scene.add.image(150, 11, 'sunny').setOrigin(1, 0).setInteractive({cursor: 'pointer'});

        // Create tooltip (hidden by default)
        this.weatherTip = this.scene.add.text(
            290, 11,
            // Just to make it look prettier with a capital first letter (basic vanilla js)
            this.weatherTipText,
            { fontSize: '10px', color: '#a8ae98', backgroundColor: '#000',  padding: { x: 5, y: 2 }}
            ).setOrigin(1, 0).setVisible(false);

        // Locking it so even when weather names change, size is the same of the box
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
        this.weatherTip.setDepth(1100);
        this.timeText.setDepth(1100);
        this.weatherIcon.setDepth(1100);

        setInterval(this.updateClock, 1000); // Should ensure the clock updates every second
    }

    update(time, delta){
        // If in game time, update time will be 6 minutes (6 hours in game). If real time, it'll be real world 6 hours to update and react weather
        // if (this.time - this.initialTime >= this.updateTimeDuration){ // 360000 ms : 6 minutes || 21600000 ms : 6 hours
        if (this.time - this.initialTime >= 5000){ // 5 seconds for testing purposes
                this.initialTime = this.time;
                this.updateWeatherState();
                this.reactToWeather();
        }
    }
}