import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.mjs";
import cors from cors;

dotenv.config();
const PORT = process.env.PORT 

connectDB();

const app = express();

app.use(express.json);
app.use(cors());

app.listen(PORT, () => {
    console.info(`[SERVER] Running on http://localhost:${PORT}`);

})