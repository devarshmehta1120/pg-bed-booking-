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
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
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
app.get("/", (req, res) => {
  res.send("PG Booking API Running...");
});

module.exports = { app };