import { Kafka } from "kafkajs";
import { TOPICS } from "./topics.mjs";

const kafka = new Kafka({
  clientId: "weather-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
let isConnected = false;

// Connect once
export const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("[Kafka] Producer connected");
  }
};

// Generic publish function
export const publishEvent = async (topic, payload) => {
  await connectProducer();
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify({
          ...payload,
          timestamp: Date.now(),
        }),
      },
    ],
  });
};

// Weather update producer
export const sendWeatherUpdate = async (city, weather) => {
  await publishEvent(TOPICS.WEATHER_UPDATES, {
    city,
    weather,
  });
};

// Weather alert producer (used by consumer)
export const sendWeatherAlert = async (alertData) => {
  await publishEvent(TOPICS.WEATHER_ALERTS, alertData);
};
