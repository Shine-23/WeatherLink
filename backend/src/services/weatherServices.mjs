import axios from "axios";
import { ApiError } from "../utils/apiError.mjs";

const {
  WEATHER_API_KEY,
  BASE_URL_CITY,
  BASE_URL_WEATHER,
} = process.env;

if (!WEATHER_API_KEY || !BASE_URL_CITY || !BASE_URL_WEATHER) {
  throw new Error(
    "Weather service env vars missing (WEATHER_API_KEY / BASE_URL_CITY / BASE_URL_WEATHER)"
  );
}

const weatherApi = axios.create({
  timeout: 8000,
});

export const getWeatherByCity = async (city) => {
 
  const geoResponse = await weatherApi.get(BASE_URL_CITY, {
    params: {
      q: city,
      limit: 1,
      appid: WEATHER_API_KEY,
    },
  });

  if (!geoResponse.data || geoResponse.data.length === 0) {
    throw new ApiError(404, "City not found");
  }

  const { lat, lon, name } = geoResponse.data[0];

  const weatherResponse = await weatherApi.get(BASE_URL_WEATHER, {
    params: {
      lat,
      lon,
      appid: WEATHER_API_KEY,
      units: "metric",
    },
  });

  const data = weatherResponse.data;

  return {
    displayName: name || data.name,
    weather: data.weather?.[0]?.main,
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon,
    temperature: data.main?.temp,
    feelsLike: data.main?.feels_like,
  };
};
