import { kafka } from "./client.mjs";
import { TOPICS } from "./topics.mjs";
import { connectProducer, sendWeatherAlert } from "./producer.mjs";

import { WeatherCache } from "../models/WeatherCache.mjs";
import { Message } from "../models/Messages.mjs";
import { normalizeCity } from "../utils/normalizeCity.mjs";

const safeJsonParse = (buf) => {
  try {
    return JSON.parse(buf.toString());
  } catch {
    return null;
  }
};

export const startConsumer = async (io) => {
  await connectProducer();

  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "weather-group",
  });

  await consumer.connect();

  await consumer.subscribe({ topic: TOPICS.WEATHER_UPDATES, fromBeginning: false });
  await consumer.subscribe({ topic: TOPICS.WEATHER_ALERTS, fromBeginning: false });

  console.log("[Kafka] Consumer subscribed to topics");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        if (!message?.value) return;

        const payload = safeJsonParse(message.value);
        if (!payload) {
          console.warn("[Kafka] Invalid JSON payload");
          return;
        }

        if (topic === TOPICS.WEATHER_UPDATES) {
          const city = normalizeCity(payload.city);
          const weather = payload.weather;

          if (!city || !weather) return;

          const currTemp = weather?.temperature;

          const prev = await WeatherCache.findOne({ city });
          const lastAlertTemp = prev?.lastAlertTemp ?? null;

          const isBelowZero = typeof currTemp === "number" && currTemp < 0;
          const shouldAlert =
            isBelowZero && (lastAlertTemp === null || currTemp !== lastAlertTemp);

          await WeatherCache.findOneAndUpdate(
            { city },
            { weather, updatedAt: new Date() },
            { upsert: true }
          );

          
          io.to(city).emit("weather-update", { city, weather });

          if (shouldAlert) {
            await WeatherCache.findOneAndUpdate(
              { city },
              { lastAlertTemp: currTemp, lastAlertAt: new Date() },
              { upsert: true }
            );

            const cityTitle = city.charAt(0).toUpperCase() + city.slice(1);

            await sendWeatherAlert({
              username: "WeatherBot",
              city,
              message: `⚠️ Alert! Temperature in ${cityTitle} is below 0°C (${currTemp}°C)`,
              type: "TEMP_BELOW_ZERO",
            });
          }

          if (!isBelowZero && lastAlertTemp !== null) {
            await WeatherCache.findOneAndUpdate(
              { city },
              { lastAlertTemp: null, lastAlertAt: null }
            );
          }

          return;
        }

        if (topic === TOPICS.WEATHER_ALERTS) {
          const city = normalizeCity(payload.city);
          if (!city) return;

          const savedAlert = await Message.create({
            username: payload.username || "WeatherBot",
            city,
            message: payload.message,
          });

     
          io.to(city).emit("receiveMessage", savedAlert);
        }
      } catch (err) {
        console.error("[Kafka] eachMessage error:", err.message);
      }
    },
  });

  return consumer; 
};
