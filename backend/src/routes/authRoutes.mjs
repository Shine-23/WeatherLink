import { Router } from "express";
import passport from "passport";
import { registerUser, loginUser, googleCallback } from "../controllers/authController.mjs";


const router = Router();

//localhost:3000/api/auth/register
router.post('api/auth/register', registerUser);

//localhost:3000/api/auth/login
router.post('/api/auth/login', loginUser);

router.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;