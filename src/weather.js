const cityName = document.querySelector("#cityName");
const CityWeatherStatus = document.querySelector("#weatherState");
const cityTemp = document.querySelector("#temp");
const cityHumidity = document.querySelector("#humidity");
const cityRain = document.querySelector("#rain");
const cityWind = document.querySelector("#wind");
const searchBar = document.querySelector("#searchBtn");
const searchIcon = document.querySelector("#searchIcon");
const flag = document.querySelector("#flag");

// NEW: Select the options list we just added in HTML
const optionsList = document.querySelector("#optionsList");

// ... existing constants ...
const loadingScreen = document.querySelector("[alt='loading...']");
const notFoundScreen = document.querySelector("[alt='404 not found']");
const weatherDetails = document.querySelector("#details"); // The main weather info div

const myLocBtn=document.querySelector("#myloc");

// --- 1. SEARCH FUNCTION (Finds list of cities) ---
async function searchCityOptions(query) {
    if(!query) return;

    try {
        // Fetch 15 results so user can choose
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=15&language=en&format=json`;
        const response = await fetch(geoUrl);
        const data = await response.json();

        // Clear previous options & Hide list initially
        optionsList.innerHTML = ""; 
        optionsList.classList.add("hidden");

        if (!data.results) {
            console.log("City not found!");
            updateUIState("error");
            return;
        }

        // Show the list
        optionsList.classList.remove("hidden");

        // Loop through results and create list items
        data.results.forEach(city => {
            const li = document.createElement("li");
            // Add styling for each option
            li.className = "p-3 hover:bg-white/20 cursor-pointer border-b border-white/10 last:border-0 text-sm transition-colors flex justify-between items-center";
            
            // Text: "Goa, Maharashtra (IN)"
            const region = city.admin1 ? `, ${city.admin1}` : "";
            li.innerHTML = `<span>${city.name}${region}</span> <span class="text-xs opacity-50 font-mono">${city.country_code}</span>`;
            
            // CLICK EVENT: When user clicks this option
            li.addEventListener("click", () => {
                // 1. Update Search Bar text
                searchBar.value = city.name;
                // 2. Hide the list
                optionsList.classList.add("hidden");
                // 3. Load the ACTUAL weather using exact Lat/Lon
                loadWeather(city.latitude, city.longitude, city.name, city.country_code);
            });

            optionsList.appendChild(li);
        });

    } catch (error) {
        console.log("Search error:", error);
    }
}

// --- 2. WEATHER FUNCTION (Gets data for specific city) ---
async function loadWeather(lat, lon, name, countryCode, isMyLoc=false) {
    try {
        updateUIState("loading");
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_probability_max,weather_code&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // DOM Updates
        cityName.textContent = name + ", " + countryCode;
        flag.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
        
        CityWeatherStatus.textContent = getWeatherStatus(weatherData.daily.weather_code[0]);
        cityTemp.textContent = weatherData.current.temperature_2m + "°C";
        cityHumidity.textContent = weatherData.current.relative_humidity_2m + "%";
        cityRain.textContent = weatherData.daily.precipitation_probability_max[0] + "%";
        cityWind.textContent = weatherData.current.wind_speed_10m + " kmph";
        updateBackground(name);
        updateUIState("success");

    } catch (error) {
        updateUIState("error");
        console.log("Weather fetch error:", error);
    }finally{
        if(!isMyLoc){
            myLocBtn.classList.remove("hidden");
        }else{
            myLocBtn.classList.add("hidden");
        }
    }
    
}

// Helper function
function getWeatherStatus(code) {
    const weatherMap = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing Rime Fog", 51: "Light Drizzle", 53: "Moderate Drizzle",
        55: "Dense Drizzle", 61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
        80: "Rain Showers", 95: "Thunderstorm"
    };
    return weatherMap[code] || "Unknown";
}

// --- EVENT LISTENERS ---

// Search when clicking icon
searchIcon.addEventListener("click", () => {
    searchCityOptions(searchBar.value);
});

// Search when pressing Enter
searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchCityOptions(searchBar.value);
    }
});

// Close list if clicking outside (UX Polish)
document.addEventListener("click", (e) => {
    if (!searchBar.contains(e.target) && !optionsList.contains(e.target) && !searchIcon.contains(e.target)) {
        optionsList.classList.add("hidden");
    }
});

// --- AUTOCOMPLETE LOGIC ---

let timeoutId; // Variable to store the timer

searchBar.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    // 1. If input is empty, hide the list immediately
    if (query.length === 0) {
        optionsList.classList.add("hidden");
        return; // Stop here
    }

    // 2. Clear the previous timer (cancels the previous search if you kept typing)
    clearTimeout(timeoutId);

    // 3. Set a new timer to wait 500ms before searching
    timeoutId = setTimeout(() => {
        searchCityOptions(query);
    }, 500); 
});

function updateUIState(state) {
    // 1. First, hide EVERYTHING (Reset)
    loadingScreen.classList.add("opacity-0");
    notFoundScreen.classList.add("opacity-0");
    weatherDetails.classList.add("opacity-0");
    
    // 2. Now, only show what is requested
    if (state === "loading") {
        loadingScreen.classList.remove("opacity-0");
    } 
    else if (state === "error") {
        notFoundScreen.classList.remove("opacity-0");
    } 
    else if (state === "success") {
        weatherDetails.classList.remove("opacity-0");
    }
}

updateUIState("loading");

// --- GET USER LOCATION (Reverse Geocoding) ---
function getUserLocation() {
    if (navigator.geolocation) {
        // Show loading screen while we wait for permission/data
        updateUIState("loading");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    // 1. REVERSE GEOCODING: Turn Lat/Lon into "City, Country"
                    // We use BigDataCloud's free API for this (no key needed)
                    const reverseGeoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
                    
                    const response = await fetch(reverseGeoUrl);
                    const data = await response.json();

                    // Extract city and country
                    // 'locality' is usually the city, 'countryCode' is "IN", etc.
                    const city = data.locality || data.city || "Current Location";
                    const country = data.countryCode || "";

                    // 2. Load the weather using your existing function
                    loadWeather(latitude, longitude, city, country,true);

                } catch (error) {
                    console.error("Error finding city name:", error);
                    // Fallback: Load weather anyway, just call it "My Location"
                    loadWeather(latitude, longitude, "My Location", "",true);
                }
            },
            (error) => {
                console.error("Location permission denied or error:", error);
                //default
                loadWeather(28.61, 77.20, "New Delhi", "IN");
                updateUIState("error"); // Or show the search screen
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


const UNSPLASH_KEY = "PDiav14ebjtI2gc04t_QSKqOjGvLpHvuTU138HYyGZ8"; 

const bgContainer = document.querySelector(".fixed"); // Selects your background div


async function updateBackground(query) {
    try {
        // 'orientation=landscape' ensures it fits a desktop screen
        const url = `https://api.unsplash.com/search/photos?page=1&query=${query} famous landmark architecture tourism&client_id=${UNSPLASH_KEY}&orientation=landscape&per_page=1`;
        
        const response = await fetch(url);
        const data = await response.json();

        // Check if we found an image
        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.full;
            
            // Call the animation function
            crossFadeBackground(imageUrl);
        }
    } catch (error) {
        console.log("Failed to load background:", error);
    }
}

// --- CROSS-FADE ANIMATION FUNCTION ---
function crossFadeBackground(imageUrl) {
    // 1. Create a new div for the incoming image
    const newBg = document.createElement("div");
    
    // 2. Style it to be a fixed background
    newBg.style.position = "fixed";
    newBg.style.top = "0";
    newBg.style.left = "0";
    newBg.style.width = "100%";
    newBg.style.height = "100%";
    newBg.style.zIndex = "-10"; // Behind everything
    newBg.style.backgroundImage = `url('${imageUrl}')`;
    newBg.style.backgroundSize = "cover";
    newBg.style.backgroundPosition = "center";
    
    // Dark overlay logic (CSS gradient) to make text readable
    // This adds a black tint over the image
    newBg.style.backgroundBlendMode = "overlay";
    newBg.style.backgroundColor = "rgba(0, 0, 0, 0.4)"; 

    // Start completely transparent
    newBg.style.opacity = "0";
    newBg.style.transition = "opacity 1.5s ease-in-out"; // The magic fade duration

    // 3. Add it to the body
    document.body.appendChild(newBg);

    // 4. Trigger the fade-in (Small delay ensures browser registers the 0 opacity first)
    setTimeout(() => {
        newBg.style.opacity = "1";
    }, 900);

    // 5. Cleanup: Find the OLD background and remove it after fade finishes
    // We select all bg divs EXCEPT the one we just made
    const oldBgs = document.querySelectorAll("div[style*='position: fixed'][style*='z-index: -10']");
    
    if (oldBgs.length > 1) { // If there is an old one...
        setTimeout(() => {
            // Remove the oldest one (index 0)
            oldBgs[0].remove(); 
        }, 1500); // Wait 3s (same as transition time)
    }
}

myLocBtn.addEventListener("click",(e)=>{getUserLocation()})

// Run this when the page loads
window.addEventListener("load", getUserLocation);
