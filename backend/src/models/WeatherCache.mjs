import mongoose from "mongoose";

const weatherCacheSchema = new mongoose.Schema({
  city: { 
        type: String, 
        required: true, 
        unique: true 
    },
  weather: { 
        type: Object, 
        required: true 
    }, 
  updatedAt: { 
        type: Date, 
        default: Date.now 
    },
  lastAlertTemp: { type: Number, default: null },
  lastAlertAt: { type: Date, default: null },
});

export const WeatherCache = mongoose.model("WeatherCache", weatherCacheSchema);
