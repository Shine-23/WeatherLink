import { getWeatherByCity } from "../services/weatherServices.mjs";
import { WeatherCache } from "../models/WeatherCache.mjs";
import { sendWeatherUpdate } from "../kafka/producer.mjs";

export const getWeather = async (req, res) => {
  try {
    const cityRaw = req.query.city;
    if (!cityRaw) {
      return res.status(400).json({ message: "City is required" });
    }

    const city = cityRaw.trim().toLowerCase();

    let cached = await WeatherCache.findOne({ city });
    const now = new Date();
    const cacheExpiryMinutes = 30;

    const isCacheValid =
      cached && (now - cached.updatedAt) / 1000 / 60 < cacheExpiryMinutes;

    if (isCacheValid) {
      await sendWeatherUpdate(city, cached.weather);
      console.log(`Kafka triggered (cached) for ${city}`);

      return res.json({ city, ...cached.weather, cached: true });
    }

    const weatherData = await getWeatherByCity(city);

    await sendWeatherUpdate(city, weatherData);
    console.log(`Weather update sent to Kafka for ${city}`);

    return res.json({ city, ...weatherData, cached: false });
  } catch (err) {
    console.error("getWeather error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
