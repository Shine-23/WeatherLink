import { Router } from "express";
import passport from "passport";
import { registerUser, loginUser, googleCallback } from "../controllers/authController.mjs";


const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);


export default router;