const express = require("express");

const {
  createBooking,
  verifyPayment,
  getBedCalendar,
  getAllBookings,
  getSingleBooking,
  checkAvailability,
  getSingleBed,
  cancelBooking
} = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/calendar/:bedId", getBedCalendar);
router.get("/check-availability", checkAvailability);

router.post("/create", protect, createBooking);
router.post("/verify-payment", protect, verifyPayment);

router.get("/", protect, adminOnly, getAllBookings);

router.get("/:id", protect, adminOnly, getSingleBooking);
router.post("/cancel", protect, cancelBooking);
module.exports = router;