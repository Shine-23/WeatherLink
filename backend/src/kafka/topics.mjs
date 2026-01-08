import { Kafka } from "kafkajs";

export const TOPICS = {
  WEATHER_UPDATES: "weather-updates",
  WEATHER_ALERTS: "weather-alerts",
};

const kafka = new Kafka({
  clientId: "weather-app",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

export const createTopics = async () => {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        { topic: TOPICS.WEATHER_UPDATES, numPartitions: 1, replicationFactor: 1 },
        { topic: TOPICS.WEATHER_ALERTS, numPartitions: 1, replicationFactor: 1 },
      ],
      waitForLeaders: true,
    });

    console.log(`[Kafka] Topics ensured: ${TOPICS.WEATHER_UPDATES}, ${TOPICS.WEATHER_ALERTS}`);
  } catch (err) {
    console.error("[Kafka] Error creating topics:", err);
  } finally {
    await admin.disconnect();
  }
};
