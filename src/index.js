function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let monthDay = date.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  return `${day}, ${monthDay} ${month} \n ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row third-row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 future">
        <div class="row days">${formatDay(forecastDay.dt)}</div>
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="" class="forecast-img" id="forecast-img" width = "42">
        <div class="row days-temp"><span class="high">${Math.round(
          forecastDay.temp.max
        )}&deg</span><span class="low">${Math.round(
          forecastDay.temp.min
        )}&deg</span></div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "bc8c015e37beb9dba84c5e94d482acec";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function enterCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#city-search");
  searchCity(newCity.value);
}

function searchCity(city) {
  let apiKey = "bc8c015e37beb9dba84c5e94d482acec";
  let apiSource = "https://api.openweathermap.org/data/2.5/";
  let apiUrl = `${apiSource}weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(currentWeather);
}

function currentWeather(weather) {
  celTemp = weather.data.main.temp;

  let temperature = Math.round(celTemp);
  let windSpeed = Math.round(weather.data.wind.speed);
  let hum = Math.round(weather.data.main.humidity);
  let cityElement = document.querySelector("#current-city");
  let tempElement = document.querySelector("#temp-num");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let descriptionElement = document.querySelector("#description");
  let dateCityElement = document.querySelector("#date-city");
  let iconElement = document.querySelector("#icon");
  console.log(weather);

  cityElement.innerHTML = weather.data.name.toUpperCase();
  tempElement.innerHTML = `${temperature}`;
  windElement.innerHTML = `${windSpeed}`;
  humidityElement.innerHTML = `${hum}`;
  descriptionElement.innerHTML = weather.data.weather[0].description;
  dateCityElement.innerHTML = formatDate(weather.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", weather.data.weather[0].description);

  getForecast(weather.data.coord);
}

let citySearch = document.querySelector("#city-form");
citySearch.addEventListener("submit", enterCity);

function currentLocation(location) {
  let apiKey = "bc8c015e37beb9dba84c5e94d482acec";
  let apiSource = "https://api.openweathermap.org/data/2.5/";
  let apiUrl = `${apiSource}weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function showTemp(response) {
  event.preventDefault();
  let city = response.data.name.toUpperCase();
  let tempNum = document.querySelector("#temp-num");
  let temp = Math.round(response.data.main.temp);
  let currentCityLocation = document.querySelector("#current-city");
  let windSpeed = Math.round(response.data.wind.speed);
  let currentHumidity = Math.round(response.data.main.humidity);
  tempNum.innerHTML = `${temp}`;
  currentCityLocation.innerHTML = `${city}`;
  document.querySelector("#wind").innerHTML = `${windSpeed}`;
  document.querySelector("#humidity").innerHTML = `${currentHumidity}`;
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}
function showFahrTemp(event) {
  event.preventDefault();
  let fahrTemp = (celTemp * 9) / 5 + 32;
  let tempElement = document.querySelector("#temp-num");
  celLink.classList.remove("active");
  fahrLink.classList.add("active");
  tempElement.innerHTML = Math.round(fahrTemp);
}

function showCelTemp(event) {
  event.preventDefault();
  celLink.classList.add("active");
  fahrLink.classList.remove("active");
  let tempElement = document.querySelector("#temp-num");
  tempElement.innerHTML = Math.round(celTemp);
}

let celTemp = null;

let currentCity = document.querySelector("#current-form");
currentCity.addEventListener("submit", getPosition);

let fahrLink = document.querySelector("#fahr-link");
fahrLink.addEventListener("click", showFahrTemp);

let celLink = document.querySelector("#cel-link");
celLink.addEventListener("click", showCelTemp);

searchCity("Amsterdam");
