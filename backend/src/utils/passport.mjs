import passport from 'passport';
import { User } from '../models/Users.mjs';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try{
        const user = await User.findOne({googleId: profile.id});
        if(user){
            return done(null, user);
        }
        const email = profile.emails?.[0]?.value;
        const newUser = await User.create({
            username: profile.displayName,
            googleId: profile.id,
            email
        });
        return done(null, newUser);
    }catch(err){
        console.log(err);
        return done(err, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  done(null, id);
});

export default passport;