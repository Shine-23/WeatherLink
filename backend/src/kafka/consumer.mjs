import { Kafka } from "kafkajs";
import { WeatherCache } from "../models/WeatherCache.mjs";
import { Message } from "../models/Messages.mjs";
import { TOPICS } from "./topics.mjs";
import { sendWeatherAlert, connectProducer } from "./producer.mjs";

const kafka = new Kafka({
  clientId: "weather-app",
  brokers: ["localhost:9092"],
});

export const startConsumer = async (io) => {
  await connectProducer();

  const consumer = kafka.consumer({ groupId: "weather-group" });
  await consumer.connect();

  await consumer.subscribe({ topic: TOPICS.WEATHER_UPDATES, fromBeginning: false });
  await consumer.subscribe({ topic: TOPICS.WEATHER_ALERTS, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        if (!message?.value) return;
        const payload = JSON.parse(message.value.toString());
  
        if (topic === TOPICS.WEATHER_UPDATES) {
          const data = payload;

          const city = (data.city || "").trim().toLowerCase();
          const currTemp = data?.weather?.temperature;

          const prev = await WeatherCache.findOne({ city });
          const lastAlertTemp = prev?.lastAlertTemp ?? null;

          const isBelowZero = typeof currTemp === "number" && currTemp < 0;
          const shouldAlert =
            isBelowZero && (lastAlertTemp === null || currTemp !== lastAlertTemp);

          await WeatherCache.findOneAndUpdate(
            { city },
            { weather: data.weather, updatedAt: new Date() },
            { upsert: true }
          );

          io.emit("weather-update", { ...data, city });

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
          const alertData = payload;
          const city = (alertData.city || "").trim().toLowerCase();

          const savedAlert = await Message.create({
            username: alertData.username || "WeatherBot",
            city,
            message: alertData.message,
          });

          io.to(city).emit("receiveMessage", savedAlert);

          return;
        }
      } catch (err) {
        console.error("[Kafka] eachMessage error:", err);
      }
    },
  });
};
