const cities = [
  { name: "Toronto", country: "CA", latitude: 43.6532, longitude: -79.3832 },
  { name: "New York", country: "US", latitude: 40.7128, longitude: -74.0060 },
  { name: "London", country: "UK", latitude: 51.5072, longitude: -0.1276 },
  { name: "Paris", country: "FR", latitude: 48.8566, longitude: 2.3522 },
  { name: "Mumbai", country: "IN", latitude: 19.0760, longitude: 72.8777 },
  { name: "Tokyo", country: "JP", latitude: 35.6762, longitude: 139.6503 },
  { name: "Dubai", country: "AE", latitude: 25.2048, longitude: 55.2708 },
  { name: "Vancouver", country: "CA", latitude: 49.2827, longitude: -123.1207 }
];

let selectedCity = 0;
let selectedStyle = "casual";
let selectedGender = "women";
let latestWeather = null;
let requestNumber = 0;

const outfitLibrary = {
  women: {
    casual: {
      cold: {
        name: "The Cozy Cold-Day Casual",
        description: "A hoodie, easy trousers, simple trainers and a practical bag create a relaxed cold-weather outfit.",
        note: "Lean into comfort first, then add one practical layer.",
        image: "assets/look-cold-casual-women.svg"
      },
      mild: {
        name: "The Everyday Mid-Season Casual",
        description: "A lightweight jacket, relaxed trousers and clean sneakers keep the look flexible for mild conditions.",
        note: "A light layer is enough when the temperature sits in the middle.",
        image: "assets/look-mild-casual-women.svg"
      },
      hot: {
        name: "The Easy Warm-Weather Casual",
        description: "A soft tee, easy shorts and light accessories keep the silhouette breathable in warm weather.",
        note: "Choose breathable pieces and keep the look light.",
        image: "assets/look-hot-casual-women.svg"
      }
    },
    formal: {
      cold: {
        name: "The Tailored Cold-Weather Edit",
        description: "A structured coat, polished skirt and heeled boots create a more dressed-up cold-weather response.",
        note: "Let the coat carry the structure while the base stays warm.",
        image: "assets/look-cold-formal-women.svg"
      },
      mild: {
        name: "The Smart Mild-Weather Edit",
        description: "A blazer, refined skirt and polished accessories create a sharper answer for a milder day.",
        note: "Mild weather is perfect for tailored layers without extra bulk.",
        image: "assets/look-mild-formal-women.svg"
      },
      hot: {
        name: "The Warm-Weather Occasion Look",
        description: "A lighter dress and minimal accessories keep the look dressed up without feeling too heavy.",
        note: "Keep the silhouette clean and the fabrics airy.",
        image: "assets/look-hot-formal-women.svg"
      }
    }
  },
  men: {
    casual: {
      cold: {
        name: "The Off-Duty Cold Casual",
        description: "A hoodie, straightforward trousers and sneakers create a relaxed look for colder temperatures.",
        note: "A hoodie keeps the casual outfit clearly separate from the formal coat option.",
        image: "assets/look-cold-casual-men.svg"
      },
      mild: {
        name: "The Everyday Layered Casual",
        description: "A light jacket, simple trousers and sneakers give enough structure without over-layering.",
        note: "Let one easy outer layer handle the mild weather.",
        image: "assets/look-mild-casual-men.svg"
      },
      hot: {
        name: "The Heat-Ready Casual Uniform",
        description: "A soft tee and shorts keep the outfit simple and breathable in warmer weather.",
        note: "When it is hot, keep the outfit loose and uncomplicated.",
        image: "assets/look-hot-casual-men.svg"
      }
    },
    formal: {
      cold: {
        name: "The Structured Winter Formal",
        description: "A long coat, dark trousers and boots create a sharper dressed-up cold-weather outfit.",
        note: "Use the coat to add polish while still protecting against the cold.",
        image: "assets/look-cold-formal-men.svg"
      },
      mild: {
        name: "The Refined Mild-Weather Formal",
        description: "A blazer and cleaner trouser line make the outfit feel polished without heavy winter layers.",
        note: "A blazer is enough structure when the temperature is moderate.",
        image: "assets/look-mild-formal-men.svg"
      },
      hot: {
        name: "The Warm-Weather Linen Edit",
        description: "A lighter shirt and cleaner trouser silhouette keep the look dressed up in warm conditions.",
        note: "Choose lighter colours and breathable fabrics when the temperature climbs.",
        image: "assets/look-hot-formal-men.svg"
      }
    }
  }
};

function getWeatherDescription(code) {
  if (code === 0) { return "Clear sky"; }
  if (code === 1 || code === 2) { return "Mainly clear"; }
  if (code === 3) { return "Cloudy"; }
  if (code === 45 || code === 48) { return "Foggy"; }
  if (code >= 51 && code <= 67) { return "Rain"; }
  if (code >= 71 && code <= 77) { return "Snow"; }
  if (code >= 80 && code <= 82) { return "Showers"; }
  if (code >= 95) { return "Stormy"; }
  return "Current conditions";
}

function hasRain(code, precipitation) {
  if (precipitation > 0.1) { return true; }
  if (code >= 51 && code <= 67) { return true; }
  if (code >= 80 && code <= 82) { return true; }
  if (code >= 95) { return true; }
  return false;
}

function hasSnow(code) {
  if (code >= 71 && code <= 77) { return true; }
  if (code === 85 || code === 86) { return true; }
  return false;
}

function getWeatherType(temperature) {
  if (temperature < 10) { return "cold"; }
  if (temperature >= 24) { return "hot"; }
  return "mild";
}

function getAccessory(weatherType, code, precipitation, wind) {
  let item = { name: "Weather-ready essentials", text: "Recommendations update with the forecast.", icon: "✳" };

  if (hasSnow(code)) {
    item.name = "Warm scarf + secure footwear";
    item.text = "Snow calls for extra warmth and more practical traction.";
    item.icon = "❄";
  } else if (hasRain(code, precipitation)) {
    item.name = "Umbrella + weather-safe layer";
    item.text = "Wet conditions make practical coverage the best accessory.";
    item.icon = "☂";
  } else if (wind >= 28) {
    item.name = "A secure outer layer";
    item.text = "Stronger wind makes a more secure silhouette easier to wear.";
    item.icon = "≈";
  } else if (weatherType === "hot") {
    item.name = selectedGender === "women" ? "Sunglasses + light tote" : "Sunglasses + clean carryall";
    item.text = "Keep accessories simple when the temperature is high.";
    item.icon = "◉";
  } else if (weatherType === "cold") {
    item.name = selectedStyle === "formal" ? "A polished cold-weather add-on" : "A cosy finishing layer";
    item.text = selectedStyle === "formal" ? "Use one extra refined layer to stay warm without losing structure." : "One softer extra layer makes a colder day easier.";
    item.icon = "✦";
  } else {
    item.name = selectedStyle === "formal" ? "A refined everyday extra" : "An easy day bag";
    item.text = selectedStyle === "formal" ? "Keep the finishing piece simple and polished." : "A practical finishing touch keeps the outfit functional.";
    item.icon = "✳";
  }

  return item;
}

function updateLook() {
  if (latestWeather === null) { return; }

  let temperature = latestWeather.apparent_temperature;
  let wind = latestWeather.wind_speed_10m;
  let code = latestWeather.weather_code;
  let precipitation = latestWeather.precipitation;
  let weatherType = getWeatherType(temperature);
  let look = outfitLibrary[selectedGender][selectedStyle][weatherType];
  let accessory = getAccessory(weatherType, code, precipitation, wind);

  document.getElementById("outfit-image").src = look.image;
  document.getElementById("outfit-image").alt = selectedGender + " " + selectedStyle + " outfit for " + weatherType + " weather";
  document.getElementById("outfit-name").textContent = look.name;
  document.getElementById("outfit-description").textContent = look.description;

  let note = look.note;
  if (wind >= 28) {
    note = note + " Stronger wind means a more secure layer will work better.";
  }
  document.getElementById("styling-note").textContent = note;

  document.getElementById("accessory-name").textContent = accessory.name;
  document.getElementById("accessory-description").textContent = accessory.text;
  document.getElementById("accessory-icon").textContent = accessory.icon;

  let lookNumber = "01";
  if (selectedGender === "women" && selectedStyle === "formal") { lookNumber = "02"; }
  if (selectedGender === "men" && selectedStyle === "casual") { lookNumber = "03"; }
  if (selectedGender === "men" && selectedStyle === "formal") { lookNumber = "04"; }
  document.getElementById("look-number").textContent = lookNumber;
  document.getElementById("visual-temp").textContent = "FEELS LIKE " + temperature + "°C";

  document.body.className = "mood-" + weatherType;
  if (hasRain(code, precipitation) && !hasSnow(code)) {
    document.body.className = "mood-rain";
  }

  let temperatureWidth = (temperature + 15) * 2;
  if (temperatureWidth < 0) { temperatureWidth = 0; }
  if (temperatureWidth > 100) { temperatureWidth = 100; }
  let windWidth = wind * 2;
  if (windWidth < 0) { windWidth = 0; }
  if (windWidth > 100) { windWidth = 100; }

  document.getElementById("heat-bar").style.width = temperatureWidth + "%";
  document.getElementById("wind-bar").style.width = windWidth + "%";
  document.getElementById("temp-signal").textContent = "FEELS LIKE " + temperature + "°C / " + weatherType.toUpperCase() + " EDIT";
  document.getElementById("wind-signal").textContent = wind >= 28 ? wind + " KM/H / WINDY" : wind + " KM/H / LIGHTER AIR";

  if (hasSnow(code)) {
    document.getElementById("rain-signal").textContent = "SNOW / EXTRA WARMTH";
    document.getElementById("precip-graphic").textContent = "❄ ❄ ❄";
  } else if (hasRain(code, precipitation)) {
    document.getElementById("rain-signal").textContent = "WET WEATHER / COVER UP";
    document.getElementById("precip-graphic").textContent = "☂ ☂ ☂";
  } else {
    document.getElementById("rain-signal").textContent = "DRY CONDITIONS / KEEP IT SIMPLE";
    document.getElementById("precip-graphic").textContent = "☀ ◌ ☀";
  }
}

function updateWeather(data) {
  if (!data.current) {
    document.getElementById("status").textContent = "Weather data unavailable. Please refresh.";
    return;
  }

  latestWeather = data.current;
  let place = cities[selectedCity];
  document.getElementById("temperature").textContent = latestWeather.temperature_2m;
  document.getElementById("condition").textContent = getWeatherDescription(latestWeather.weather_code);
  document.getElementById("feels-like").textContent = latestWeather.apparent_temperature + "°C";
  document.getElementById("wind").textContent = latestWeather.wind_speed_10m + " km/h";
  document.getElementById("humidity").textContent = latestWeather.relative_humidity_2m + "%";
  document.getElementById("display-city").textContent = place.name.toUpperCase() + " / " + place.country;
  document.getElementById("status").textContent = "Live forecast-model data loaded · Refresh to update";
  updateLook();
}

function resetPendingState(place) {
  document.getElementById("status").textContent = "Fetching live conditions…";
  document.getElementById("display-city").textContent = place.name.toUpperCase() + " / " + place.country;
  document.getElementById("temperature").textContent = "--";
  document.getElementById("condition").textContent = "Connecting to the weather...";
  document.getElementById("feels-like").textContent = "--°C";
  document.getElementById("wind").textContent = "-- km/h";
  document.getElementById("humidity").textContent = "--%";
  document.getElementById("outfit-name").textContent = "Curating your look…";
  document.getElementById("outfit-description").textContent = "Checking current conditions in " + place.name + ".";
  document.getElementById("outfit-image").src = "assets/look-mild-casual-women.svg";
  document.getElementById("outfit-image").alt = "Loading outfit illustration";
  document.getElementById("styling-note").textContent = "Choose a city, gender and occasion, then watch your style edit adapt.";
  document.body.className = "mood-neutral";
}

function fetchWeather() {
  let place = cities[selectedCity];
  requestNumber = requestNumber + 1;
  let thisRequest = requestNumber;
  latestWeather = null;
  resetPendingState(place);

  let url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude + "&longitude=" + place.longitude + "&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=auto";

  fetch(url)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("The weather service did not respond successfully.");
      }
      return response.json();
    })
    .then(function(data) {
      if (thisRequest === requestNumber) {
        updateWeather(data);
      }
    })
    .catch(function(error) {
      if (thisRequest === requestNumber) {
        document.getElementById("status").textContent = "Could not load live weather. Check your connection and press ↻.";
        document.getElementById("condition").textContent = "Forecast unavailable";
        document.getElementById("outfit-name").textContent = "Your edit is on hold";
        document.getElementById("outfit-description").textContent = "We are not showing made-up conditions. Retry to get a real forecast.";
        document.getElementById("accessory-name").textContent = "Awaiting live conditions";
        document.getElementById("accessory-description").textContent = "Refresh to load your styling advice.";
        document.getElementById("heat-bar").style.width = "0%";
        document.getElementById("wind-bar").style.width = "0%";
        document.getElementById("temp-signal").textContent = "AWAITING DATA";
        document.getElementById("wind-signal").textContent = "AWAITING DATA";
        document.getElementById("rain-signal").textContent = "AWAITING DATA";
        console.error("Weather API error:", error);
      }
    });
}

function setStyle(style) {
  selectedStyle = style;
  document.getElementById("casual").className = style === "casual" ? "choice-btn selected" : "choice-btn";
  document.getElementById("formal").className = style === "formal" ? "choice-btn selected" : "choice-btn";
  updateLook();
}

function setGender(gender) {
  selectedGender = gender;
  document.getElementById("women").className = gender === "women" ? "choice-btn selected" : "choice-btn";
  document.getElementById("men").className = gender === "men" ? "choice-btn selected" : "choice-btn";
  updateLook();
}

document.getElementById("city").onchange = function() {
  selectedCity = Number(document.getElementById("city").value);
  fetchWeather();
};
document.getElementById("refresh").onclick = function() { fetchWeather(); };
document.getElementById("casual").onclick = function() { setStyle("casual"); };
document.getElementById("formal").onclick = function() { setStyle("formal"); };
document.getElementById("women").onclick = function() { setGender("women"); };
document.getElementById("men").onclick = function() { setGender("men"); };

fetchWeather();
