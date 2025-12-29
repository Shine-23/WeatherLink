import axios from "axios";

export const getWeatherByCity = async (city) => {
    const apiKey = process.env.WEATHER_API_KEY;
    const url_city = process.env.BASE_URL_CITY;
    const url_weather = process.env.BASE_URL_WEATHER;
    try{
        const cityCoordinates = await axios.get(url_city, {
            params:{
                q: city,
                limit:1,
                appid: apiKey  
            }
        });

        if(cityCoordinates.data.length === 0 || !cityCoordinates.data){
            throw new Error('City not found');
        }

        const { lat, lon } = cityCoordinates.data[0]; 

        const weather = await axios.get(url_weather, {
            params:{
                lat,
                lon,
                appid: apiKey,
                units: 'metric'
            }
        });

        return{
            city: weather.data.name,
            weather: weather.data.weather[0].main,
            description: weather.data.weather[0].description, 
            icon: weather.data.weather[0].icon,
            temperature: weather.data.main.temp,
            feels_like: weather.data.main.feels_like
        };

    } catch(err) {
        console.error(`[API Error] ${err.message} `);
        throw new Error('Error fetching weather data');
    }
}

