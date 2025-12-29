import { Kafka } from "kafkajs";
import { WeatherCache } from "../models/WeatherCache.mjs";
import io from "../../index.mjs";
import { Message } from "../models/Messages.mjs";

export const startConsumer = async () => {
    const kafka = new Kafka({ clientId: "weather-app", brokers: ["localhost:9092"] });
    const consumer = kafka.consumer({ groupId: "weather-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "weather-updates", fromBeginning: false });

    await consumer.run({
    eachMessage: async ({ message }) => {
    const data = JSON.parse(message.value.toString());

    const prev = await WeatherCache.findOne({ city: data.city });

    const prevTemp = prev?.weather?.temperature;
    const currTemp = data.weather.temperature;

    const isFirstTime = !prev;
    const isBelowZero = currTemp < 0;
    const hasChanged = prevTemp !== currTemp;

    const shouldAlert =
    isBelowZero &&
    (isFirstTime || hasChanged);

    // Update cache AFTER reading prev
    await WeatherCache.findOneAndUpdate(
      { city: data.city },
      { weather: data.weather, updatedAt: new Date() },
      { upsert: true }
    );

    if (shouldAlert) {
      const cityTitle =
        data.city.charAt(0).toUpperCase() + data.city.slice(1).toLowerCase();

      const savedAlert = await Message.create({
        username: "WeatherBot",
        city: data.city,
        message: `⚠️ Alert! Temperature in ${cityTitle} is below 0°C (${currTemp}°C)`
      });

      io.emit("receiveMessage", savedAlert);
    }

    io.emit("weather-update", data);
  }
});
}