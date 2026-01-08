import mongoose from "mongoose";

export const connectDB = async () => {
  const { DB_URI } = process.env;

  if (!DB_URI) {
    console.error("[MongoDB] DB_URI is missing in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI, {
      autoIndex: true,
    });

    console.info("[MongoDB] Connected successfully");
  } catch (err) {
    console.error("[MongoDB] Connection failed:", err.message);
    process.exit(1);
  }
};
