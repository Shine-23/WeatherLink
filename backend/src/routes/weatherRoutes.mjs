import { Router } from "express";
import { protect } from "../middleware/authMiddleware.mjs";
import { getWeather, getCityMessages } from "../controllers/weatherController.mjs";

const router = Router();

// GET /api/weather?city=toronto
router.get("/", protect, getWeather);

// GET /api/weather/messages/:city
router.get("/messages/:city", protect, getCityMessages);

export default router;
