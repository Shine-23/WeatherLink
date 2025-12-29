import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.mjs";
import cors from "cors";
import passport from "passport";
import routes from "./src/routes/router.mjs";
import http from "http";
import { initSocket } from "./src/server.mjs";


dotenv.config();
const PORT = process.env.PORT 

connectDB();

const app = express();

app.use(express.json);
app.use(cors());

app.use(passport.initialize());
app.use("/api", routes);

const server = http.createServer(app);
initSocket(server);

app.get('/', (req, res) => {
    res.send('WeatherLink Backend is running');
});

app.listen(PORT, () => {
    console.info(`[SERVER] Running on http://localhost:${PORT}`);

})