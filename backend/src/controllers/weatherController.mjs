import { getWeatherByCity } from "../services/weatherServices.mjs";

export const getWeather = async (req, res) => {
    try{
        //GET /api/weather?city=Toronto
        const city = req.query.city.toLowerCase();
        if(!city){
            return res.status(400).json({message: '[Unknown] City'});
        }
        const weatherData = await getWeatherByCity(city);
        res.json(weatherData);
    } catch(err){
        res.status(500).json({message: 'Server Error'});   
    }
}