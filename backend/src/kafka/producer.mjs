import { kafka } from "./client.mjs";
import { TOPICS } from "./topics.mjs";

const producer = kafka.producer();
let connected = false;

export const connectProducer = async () => {
  if (connected) return;
  await producer.connect();
  connected = true;
  console.log("[Kafka] Producer connected");
};

export const disconnectProducer = async () => {
  if (!connected) return;
  await producer.disconnect();
  connected = false;
  console.log("[Kafka] Producer disconnected");
};

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

export const sendWeatherUpdate = (city, weather) =>
  publishEvent(TOPICS.WEATHER_UPDATES, { city, weather });

export const sendWeatherAlert = (alertData) =>
  publishEvent(TOPICS.WEATHER_ALERTS, alertData);
