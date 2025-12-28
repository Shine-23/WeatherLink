import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type:  mongoose.Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type:  mongoose.Schema.Types.String,
      required: true,
      minlength: 6,
    },
    createdAt: {
      type:  mongoose.Schema.Types.Date,
      default: Date.now,
    },
  },
  { 
    versionKey: false 
});