
    const apiKey = '4d8fb5b93d4af21d66a2948710284366'; // OpenWeatherMap API key
    const weatherInfo = document.getElementById('weatherInfo');
    const errorMessage = document.getElementById('errorMessage');

    async function getWeather(lat = null, lon = null) {
        const city = document.getElementById('cityInput').value;
        errorMessage.style.display = 'none';
        weatherInfo.style.opacity = '0.5';

        try {
            let url;
            if (lat && lon) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            } else {
                url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === '404') {
                errorMessage.textContent = 'City not found. Please try again.';
                errorMessage.style.display = 'block';
                return;
            }

            updateWeatherUI(data);
        } catch (error) {
            errorMessage.textContent = 'Error fetching weather data. Please try again.';
            errorMessage.style.display = 'block';
        } finally {
            weatherInfo.style.opacity = '1';
        }
    }

    function updateWeatherUI(data) {
        document.querySelector('.city').textContent = `${data.name}, ${data.sys.country}`;
        document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector('.condition').textContent = data.weather[0].description.charAt(0).toUpperCase() + 
            data.weather[0].description.slice(1);
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

        // Update weather icon
        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').innerHTML = 
            `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">`;

        // Reset animations
        const elements = document.querySelectorAll('.city, .temperature, .condition, .details');
        elements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = null;
        });
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    errorMessage.textContent = 'Error getting location. Please enter city manually.';
                    errorMessage.style.display = 'block';
                }
            );
        } else {
            errorMessage.textContent = 'Geolocation is not supported by this browser.';
            errorMessage.style.display = 'block';
        }
    }

    // Handle Enter key press
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getWeather();
        }
    });

