import { kafka } from "./client.mjs";
import { TOPICS } from "./topics.mjs";

export const createTopics = async () => {
  const admin = kafka.admin();

  try {
    await admin.connect();

    await admin.createTopics({
      topics: [
        { topic: TOPICS.WEATHER_UPDATES, numPartitions: 1, replicationFactor: 1 },
        { topic: TOPICS.WEATHER_ALERTS, numPartitions: 1, replicationFactor: 1 },
      ],
      waitForLeaders: true,
    });

    console.log(`[Kafka] Topics ensured: ${Object.values(TOPICS).join(", ")}`);
  } catch (err) {
    console.error("[Kafka] Topic creation error:", err.message);
  } finally {
    await admin.disconnect();
  }
};
