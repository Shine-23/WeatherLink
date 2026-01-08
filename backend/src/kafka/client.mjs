import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092")
  .split(",")
  .map((b) => b.trim())
  .filter(Boolean);

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "weather-app",
  brokers,
});
