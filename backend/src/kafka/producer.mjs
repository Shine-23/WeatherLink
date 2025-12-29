import { Kafka } from "kafkajs";

export const sendWeatherUpdate = async (city, weather) => {
    const kafka = new Kafka({ clientId: "weather-app", brokers: ["localhost:9092"] });
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: "weather-updates",
        messages: [{ value: JSON.stringify({ city, weather, timestamp: Date.now() }) }],
    });
    await producer.disconnect();
};