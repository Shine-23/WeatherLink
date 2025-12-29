import { getWeatherByCity } from "../services/weatherServices.mjs";
import { WeatherCache } from "../models/WeatherCache.mjs";
import { sendWeatherUpdate } from "../kafka/producer.mjs";


export const getWeather = async (req, res) => {
    try{
        //GET /api/weather?city=Toronto
        const city = req.query.city.toLowerCase();
        if(!city){
            return res.status(400).json({message: '[Unknown] City'});
        }

        let cached = await WeatherCache.findOne({ city });
        const now = new Date();
        const cacheExpiryMinutes = 30; 
        const isCacheValid = cached && (now - cached.updatedAt) / 1000 / 60 < cacheExpiryMinutes;
        if (isCacheValid) {
            sendWeatherUpdate(city, cached.weather)
                .then(() => console.log(`Kafka triggered (cached) for ${city}`))
                .catch(err => console.error('Kafka error:', err));
            return res.json({ ...cached.weather, cached: true });
        }

        const weatherData = await getWeatherByCity(city);
        
        sendWeatherUpdate(city, weatherData)
            .then(() => console.log(`Weather update sent to Kafka for ${city}`))
            .catch(err => console.error('Kafka error:', err));
            
        res.json({ ...weatherData, cached: false });
    } catch(err){
        res.status(500).json({message: 'Server Error'});   
    }
}