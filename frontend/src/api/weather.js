import { api } from "./client";

export const fetchWeather = async (city) => {
  const res = await api.get("/api/weather", { params: { city } });
  return res.data;
};

export const fetchMessagesByCity = async (city) => {
  const res = await api.get(`/api/weather/messages/${city}`);
  return res.data;
};
