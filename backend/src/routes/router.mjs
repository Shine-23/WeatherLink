import authRoutes from "./authRoutes.mjs";
import weatherRoutes from "./weatherRoutes.mjs";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoutes);
router.use("/weather", weatherRoutes);

export default router;