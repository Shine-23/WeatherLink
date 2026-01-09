import path from "path";
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

  const distPath = path.resolve(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.use(notFoundMiddleware);

  app.use(errorMiddleware);

  return app;
};