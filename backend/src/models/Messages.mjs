import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    username: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    city: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    message: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    createdAt: { 
        type: mongoose.Schema.Types.Date, 
        default: Date.now,
        expires: '7d' 
    }
});

export const Message = mongoose.model("Message", MessageSchema);