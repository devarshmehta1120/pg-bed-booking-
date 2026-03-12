const Booking = require("../models/Booking");
const Bed = require("../models/Bed");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");


/* ================= CHECK BED AVAILABILITY ================= */

exports.checkAvailability = async (req, res) => {
  try {

    const { bedId, startDate, endDate } = req.query;

    if (!bedId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "bedId, startDate and endDate required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bed ID"
      });
    }

    const conflict = await Booking.findOne({
      bed: bedId,
      status: { $in: ["pending", "paid", "booked"] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    });

    if (conflict) {
      return res.json({
        success: true,
        available: false,
        message: "Bed already booked for these dates"
      });
    }

    res.json({
      success: true,
      available: true
    });

  } catch (error) {

    console.error("Check Availability Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};



/* ================= BED BOOKING CALENDAR ================= */

exports.getBedCalendar = async (req, res) => {
  try {

    const { bedId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bed ID"
      });
    }

    const bookings = await Booking.find({
      bed: bedId,
      status: "paid"
    }).select("startDate endDate");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {

    console.error("Calendar Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching calendar"
    });
  }
};



/* ================= CREATE BOOKING ================= */

exports.createBooking = async (req, res) => {
  try {

    const { room, bed, startDate, endDate, amount } = req.body;

    if (!room || !bed || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Room, bed, startDate and endDate required"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bed)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bed ID"
      });
    }

    const bedExists = await Bed.findById(bed);

    if (!bedExists) {
      return res.status(404).json({
        success: false,
        message: "Bed not found"
      });
    }

    /* CHECK DATE CONFLICT */

    const conflict = await Booking.findOne({
      bed,
      status: { $in: ["paid", "booked"] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Bed already booked for selected dates"
      });
    }

    /* CREATE BOOKING */

    const booking = await Booking.create({
      user: req.user._id,
      room,
      bed,
      startDate,
      endDate,
      amount,
      status: "pending"
    });

    /* CREATE RAZORPAY ORDER */

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: booking._id.toString()
    });

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      order
    });

  } catch (error) {

    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating booking"
    });

  }
};



/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {

  try {

    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.paymentId = razorpay_payment_id;
    booking.status = "paid";

    await booking.save();

    res.json({
      success: true,
      message: "Payment successful"
    });

  } catch (error) {

    console.error("Verify Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



/* ================= GET ALL BOOKINGS (ADMIN) ================= */

exports.getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room")
      .populate("bed")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {

    console.error("Get Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings"
    });

  }
};



/* ================= GET SINGLE BOOKING ================= */

  exports.getSingleBooking = async (req, res) => {
    try {

      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID"
        });
      }

      const booking = await Booking.findById(id)
        .populate("user", "name email")
        .populate("room")
        .populate("bed");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });

    } catch (error) {

      console.error("Get Booking Error:", error);

      res.status(500).json({
        success: false,
        message: "Server error while fetching booking"
      });

    }
  };

exports.cancelBooking = async (req, res) => {
  try {

    const { bookingId } = req.body;

    /* CHECK BOOKING ID PROVIDED */

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

    /* VALIDATE OBJECT ID */

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Booking ID"
      });
    }

    /* FIND BOOKING */

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    /* CHECK IF ALREADY CANCELLED */

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled"
      });
    }

    /* UPDATE STATUS */

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });

  } catch (error) {

    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking"
    });

  }
};