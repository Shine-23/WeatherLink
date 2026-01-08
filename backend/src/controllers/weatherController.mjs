import { WeatherCache } from "../models/WeatherCache.mjs";
import { getWeatherByCity } from "../services/weatherServices.mjs";
import { sendWeatherUpdate } from "../kafka/producer.mjs";
import { Message } from "../models/Messages.mjs";

import { asyncHandler } from "../utils/asyncHandler.mjs";
import { ApiError } from "../utils/apiError.mjs";
import { normalizeCity } from "../utils/normalizeCity.mjs";

const CACHE_EXPIRY_MINUTES = 30;

export const getWeather = asyncHandler(async (req, res) => {
  const cityQuery = req.query.city;
  const city = normalizeCity(cityQuery);

  if (!city) throw new ApiError(400, "City is required");

  const cached = await WeatherCache.findOne({ city });
  const now = Date.now();

  const isCacheValid =
    cached &&
    (now - new Date(cached.updatedAt).getTime()) / 1000 / 60 < CACHE_EXPIRY_MINUTES;

  if (isCacheValid) {
    await sendWeatherUpdate(city, cached.weather);
    return res.json({ city, ...cached.weather, cached: true });
  }

  const weatherData = await getWeatherByCity(city);

  await sendWeatherUpdate(city, weatherData);

  return res.json({ city, ...weatherData, cached: false });
});

export const getCityMessages = asyncHandler(async (req, res) => {
  const cityParam = req.params.city;
  const city = normalizeCity(cityParam);

  if (!city) throw new ApiError(400, "City is required");

  const messages = await Message.find({ city }).sort({ createdAt: 1 });
  res.json(messages);
});
