import "./config/env.mjs";

import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import { createApp } from "./app.mjs";
import { connectDB } from "./config/db.mjs";
import { registerSocketHandlers } from "./config/socket.mjs";
import { createTopics } from "./kafka/admin.mjs";          
import { startConsumer } from "./kafka/consumer.mjs";
import { disconnectProducer } from "./kafka/producer.mjs"; 

const PORT = process.env.PORT || 5000;

let httpServer;
let kafkaConsumer;

const shutdown = async (signal) => {
  try {
    console.log(`[Shutdown] Received ${signal}. Closing resources...`);

    if (kafkaConsumer) {
      await kafkaConsumer.disconnect();
      console.log("[Kafka] Consumer disconnected");
    }

    await disconnectProducer(); 

    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
      console.log("[Server] HTTP server closed");
    }

    await mongoose.connection.close();
    console.log("[MongoDB] Connection closed");

    process.exit(0);
  } catch (err) {
    console.error("[Shutdown] Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

const bootstrap = async () => {
  try {
    await connectDB();
    console.log("[DB] Connected");

    await createTopics();
    console.log("[Kafka] Topics ensured");

    const app = createApp();

    httpServer = http.createServer(app);
    const io = new Server(httpServer, { cors: { origin: "*" } });

    registerSocketHandlers(io);

    kafkaConsumer = await startConsumer(io); 
    console.log("[Kafka] Consumer started");

    httpServer.listen(PORT, () => {
      console.info(`[SERVER] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

bootstrap();
