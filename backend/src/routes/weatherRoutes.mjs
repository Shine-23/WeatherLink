import { Router } from "express";
import { getWeather } from "../controllers/weatherController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = Router();

//localhost:3000/api/weather?city=Toronto
router.get('/', protect, getWeather);

//localhost:3000/api/weather/messages/:city
router.get('/messages/:city', protect, async (req, res) => {
    try {
        const messages = await Message.find({ city: req.params.city }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

export default router;