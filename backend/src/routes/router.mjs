import authRoutes from "./authRoutes.mjs";
import weatherRoutes from "./weatherRoutes.mjs";
import { Router } from "express";

const router = Router();

router.use(authRoutes);
router.use(weatherRoutes);

export default router;