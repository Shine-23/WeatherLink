import { Router } from "express";
import passport from "passport";
import { registerUser, loginUser, googleCallback } from "../controllers/authController.mjs";


const router = Router();

//localhost:3000/api/auth/register
router.post('/register', registerUser);

//localhost:3000/api/auth/login
router.post('/login', loginUser);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;