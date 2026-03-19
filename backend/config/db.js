const mongoose = require("mongoose");
const Booking = require("../models/Booking");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
     try {
      await Booking.syncIndexes(); // ✅ NOW VALID
      console.log("✅ Indexes synced");
    } catch (err) {
      console.error("❌ Index sync error:", err);
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
  
};

module.exports = connectDB;