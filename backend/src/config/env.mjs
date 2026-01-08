import dotenv from "dotenv";
dotenv.config();

const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[ENV] Missing ${key}`);
  }
}
