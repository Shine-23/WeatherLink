import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/Users.mjs";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const username = profile.displayName;
        const email = profile.emails?.[0]?.value;

        const existingUser = await User.findOne({ googleId });
        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          username,
          googleId,
          email,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

