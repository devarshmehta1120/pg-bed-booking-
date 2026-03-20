require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const bedRoutes = require("./routes/bedRoutes");
const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/upload");
const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://pg-bed-booking-eony.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
// serve local uploads (only for local mode)
app.use("/uploads", express.static("uploads"));

app.use("/api/upload", uploadRoutes);
app.get("/", (req, res) => {
  res.send("PG Booking API Running...");
});

module.exports = { app };