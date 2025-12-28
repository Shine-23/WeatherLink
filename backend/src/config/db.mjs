import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URI);
        console.info(`[MongoDB] connected successfully.`)
    } catch(err){
        console.error(`MongoDB connection error:${err.message}.`);
        process.exit(1);
    }
}