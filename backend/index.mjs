import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import routes from "./src/routes/router.mjs";
import http from "http";
import { Server } from "socket.io";
import { User } from "./src/models/Users.mjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Message } from "./src/models/Messages.mjs";
import { startConsumer } from "./src/kafka/consumer.mjs";
import { createTopics } from "./src/kafka/topics.mjs";
import { connectDB } from "./src/config/db.mjs";

dotenv.config();
const PORT = process.env.PORT || 5000;

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(routes);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        const email = profile.emails?.[0]?.value;
        const newUser = await User.create({
          username: profile.displayName,
          googleId: profile.id,
          email,
        });
        return done(null, newUser);
      } catch (err) {
        console.log(err);
        return done(err, false);
      }
    }
  )
);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const normalizeCity = (city) => (city || "").trim().toLowerCase();

io.on("connection", (socket) => {
  socket.on("joinRoom", async (city) => {
    try {
      const normalizedCity = normalizeCity(city);
      if (!normalizedCity) return;

      socket.join(normalizedCity);

      const history = await Message.find({ city: normalizedCity })
        .sort({ createdAt: -1 })
        .limit(30);

      socket.emit("chat-history", history.reverse());
    } catch (err) {
      console.error("joinRoom error:", err.message);
    }
  });

  socket.on("sendMessage", async (msgData) => {
    try {
      const normalizedCity = normalizeCity(msgData.city);

      const savedMsg = await Message.create({
        username: msgData.username,
        city: normalizedCity,
        message: msgData.message,
      });

      // ✅ Emit only to that city room
      io.to(normalizedCity).emit("receiveMessage", savedMsg);
    } catch (err) {
      console.error("Error saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.get("/", (req, res) => res.send("WeatherLink Backend is running"));

const bootstrap = async () => {
  try {
    await connectDB();
    console.log("[DB] Connected");

    await createTopics();
    console.log("[Kafka] Topics ensured");

    await startConsumer(io);
    console.log("[Kafka] Consumer started");

    server.listen(PORT, () => {
      console.info(`[SERVER] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

bootstrap();

export default io;
