import express from "express";
import cors from "cors";
import passport from "passport";
import routes from "./routes/router.mjs";
import "./config/passport.mjs"; 
import { errorMiddleware } from "./middleware/errorMiddleware.mjs";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.mjs";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(passport.initialize());

  app.use("/api", routes);

  app.get("/", (req, res) => res.send("WeatherLink Backend is running"));

  app.use(notFoundMiddleware);

  app.use(errorMiddleware);

  return app;
};