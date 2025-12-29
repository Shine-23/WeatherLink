import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "weather-app",
  brokers: ["localhost:9092"]
});

const admin = kafka.admin();

export const createTopics = async () => {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: "weather-updates",
          numPartitions: 1,
          replicationFactor: 1
        }
      ],
      waitForLeaders: true
    });
    console.log("[Kafka] Topic 'weather-updates' ensured");
  } catch (err) {
    console.error("[Kafka] Error creating topics:", err);
  } finally {
    await admin.disconnect();
  }
};
