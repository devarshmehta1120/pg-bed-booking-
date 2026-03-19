const express = require("express");

const {
  createBooking,
  verifyPayment,
  getBedCalendar,
  getAllBookings,
  getSingleBooking,
  checkAvailability,
  cancelBooking,
  getMyBookings,
  refundBooking,
  downloadReceipt
} = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* BED CALENDAR */
router.get("/calendar/:bedId", getBedCalendar);

/* CHECK AVAILABILITY */
router.get("/check-availability", checkAvailability);

/* CREATE BOOKING */
router.post("/create", protect, createBooking);

/* VERIFY PAYMENT */
router.post("/verify-payment", protect, verifyPayment);

/* CANCEL BOOKING */
router.put("/cancel/:id", protect, cancelBooking);
router.get("/receipt/:id", protect, downloadReceipt);

/* USER BOOKINGS */
router.get("/my-bookings", protect, getMyBookings);

/* ADMIN BOOKINGS */
router.get("/", protect, adminOnly, getAllBookings);

/* REFUND BOOKING */
router.put("/refund/:id", protect, refundBooking);

/* SINGLE BOOKING (ADMIN) */
router.get("/:id", protect, adminOnly, getSingleBooking);

module.exports = router;