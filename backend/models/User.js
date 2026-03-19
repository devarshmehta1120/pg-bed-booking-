const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    default: ""
  },

  avatar: {
    type: String,
    default: "" // store image URL (Cloudinary later)
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
   // ✅ OTP fields
  otp: String,
  otpExpiry: Date,

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);