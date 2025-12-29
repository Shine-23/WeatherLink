import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.mjs";
import cors from "cors";
import passport from "passport";
import routes from "./src/routes/router.mjs";
import http from "http";
import { Server } from "socket.io";
import { User } from './src/models/Users.mjs';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Message } from "./src/models/Messages.mjs";
import { startConsumer } from "./src/kafka/consumer.mjs";
import { createTopics } from "./src/kafka/topics.mjs";

dotenv.config();
const PORT = process.env.PORT 

connectDB();

createTopics().then(() => {
  startConsumer(); 
});

const app = express();

app.use(express.json());
app.use(cors());

app.use(passport.initialize());
app.use(routes);

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } 
});

io.on('connection', (socket) => { 
    socket.on('joinRoom', (city) => {
        socket.join(city);
    });

    socket.on('sendMessage', async (msgData) => {
    try {
        const savedMsg = await Message.create({
        username: msgData.username, 
        city: msgData.city,
        message: msgData.message,
        });

        io.to(msgData.city).emit('receiveMessage', savedMsg);
    } catch (err) {
        console.error("Error saving message:", err.message);
    }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });

});


app.get('/', (req, res) => {
    res.send('WeatherLink Backend is running');
});

server.listen(PORT, () => {
    console.info(`[SERVER] Running on http://localhost:${PORT}`);

})

export default io;