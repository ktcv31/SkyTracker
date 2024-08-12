
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('city-input');
    const searchForm = document.getElementById('search-form');
    const currentWeatherSection = document.getElementById('current-weather');
    const forecastSection = document.getElementById('forecast');
    const historyList = document.getElementById('history-list');

    const API_KEY = "cee0e411bed373f23ea7142a06136de9";
    const API_URL_WEATHER = 'https://api.openweathermap.org/data/2.5/weather';
    const API_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherDataByCity(city);
            addToHistory(city);
            cityInput.value = '';
        } else {
            showError('Please enter a city name.');
        }
    });

    function fetchWeatherDataByCity(city) {
        fetch(`${API_URL_WEATHER}?q=${city}&appid=${API_KEY}&units=imperial`)
            .then(response => response.json())
            .then(data => displayCurrentWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
        fetch(`${API_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=imperial`)
            .then(response => response.json())
            .then(data => displayForecast(data))
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function displayCurrentWeather(data) {
        const { name, weather, main, wind } = data;
        currentWeatherSection.innerHTML = `
            <h2>${name} (${new Date().toLocaleDateString()}) <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}"></h2>
            <p>Temp: ${main.temp}°F</p>
            <p>Wind: ${wind.speed} MPH</p>
            <p>Humidity: ${main.humidity} %</p>
        `;
    }

    function displayForecast(data) {
        forecastSection.innerHTML = '<h2>5-Day Forecast:</h2>';
        for (let i = 0; i < data.list.length; i += 8) { // Adjusting the step to get daily data
            const { dt, weather, main, wind } = data.list[i];
            const date = new Date(dt * 1000);
            forecastSection.innerHTML += `
                <div>
                    <p>${date.toLocaleDateString()}</p>
                    <p><img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}"></p>
                    <p>Temp: ${main.temp} °F</p>
                    <p>Wind: ${wind.speed} MPH</p>
                    <p>Humidity: ${main.humidity} %</p>
                </div>
            `;
        }
    }

    function addToHistory(city) {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => fetchWeatherDataByCity(city));
        historyList.appendChild(li);
    }

    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }
});
