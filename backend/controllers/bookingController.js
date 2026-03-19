const Booking = require("../models/Booking");
const Bed = require("../models/Bed");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const generateReceipt = require("../utils/generateReceipt");
const sendEmail = require("../utils/sendEmail");
// const sendSMS = require("../utils/sendSMS");
const User = require("../models/User");
const Room = require("../models/Room");
const PDFDocument = require("pdfkit");
const fs = require("fs");
exports.downloadReceipt = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("room bed user");

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${booking._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Booking Receipt", { align: "center" });

  doc.moveDown();
  doc.text(`User: ${booking.user.name}`);
  doc.text(`Room: ${booking.room.roomNumber}`);
  doc.text(`Bed: ${booking.bed.bedNumber}`);
  doc.text(`Amount: ₹${booking.amount}`);
  doc.text(`Status: ${booking.bookingStatus}`);
  doc.text(`Payment: ${booking.paymentStatus}`);

  doc.end();
};

/* ================= CHECK BED AVAILABILITY ================= */

exports.checkAvailability = async (req, res) => {
  try {
    const { bedId, startDate, endDate } = req.query;

    if (!bedId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "bedId, startDate and endDate required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bed ID",
      });
    }

    const conflict = await Booking.findOne({
      bed: bedId,
      bookingStatus: { $in: ["pending", "confirmed"] },
      startDate: { $lt: new Date(endDate) },   // ✅ FIX
  endDate: { $gt: new Date(startDate) },   // ✅ FIX
    });

    if (conflict) {
      return res.json({
        success: true,
        available: false,
        message: "Bed already booked for these dates",
      });
    }

    res.json({
      success: true,
      available: true,
    });
  } catch (error) {
    console.error("Check Availability Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
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
        message: "Invalid Bed ID",
      });
    }

    const bookings = await Booking.find({
      bed: bedId,
      bookingStatus: { $in: ["pending", "confirmed"] },
    }).select("startDate endDate");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Calendar Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching calendar",
    });
  }
};

/* ================= CREATE BOOKING ================= */

exports.createBooking = async (req, res) => {
  try {
    const { room, bed, startDate, endDate, amount } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!room || !bed || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Room, bed, startDate and endDate required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // ✅ Add check-in / checkout time
    start.setHours(12, 0, 0, 0); // Check-in 12 PM
    end.setHours(11, 0, 0, 0);   // Check-out 11 AM

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bed)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bed ID",
      });
    }

    const bedExists = await Bed.findById(bed);

    if (!bedExists) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    /* ✅ CHECK DATE CONFLICT (CORRECT LOGIC) */

    const conflict = await Booking.findOne({
      bed,
      bookingStatus: { $in: ["pending", "confirmed"] },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Bed already booked for selected dates",
      });
    }

    /* ✅ CREATE BOOKING */

    const booking = await Booking.create({
      user: req.user._id,
      room,
      bed,
      startDate: start,
      endDate: end,
      amount,
      bookingStatus: "pending",
      paymentStatus: "pending",
    });

    /* ✅ CREATE RAZORPAY ORDER */

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    });

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      order,
    });

  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
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
      razorpay_signature,
    } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("user room bed"); // ✅ IMPORTANT

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ❌ Payment failed
    if (!razorpay_payment_id) {
      await Booking.findByIdAndDelete(bookingId);

      return res.status(400).json({
        success: false,
        message: "Payment failed, booking removed",
      });
    }

    // ✅ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Booking.findByIdAndDelete(bookingId);

      return res.status(400).json({
        success: false,
        message: "Invalid signature, booking removed",
      });
    }

    /* ================= PAYMENT SUCCESS ================= */

    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";
    booking.paymentId = razorpay_payment_id;

    await booking.save();

    /* ================= SEND RECEIPT EMAIL ================= */

    try {
      // ✅ Generate PDF
      const pdfPath = await generatePDF(booking);

      // ✅ Send Email
      await sendEmail({
        to: booking.user.email,
        subject: "🎉 Booking Confirmed",
        text: "Your booking is confirmed. Receipt attached.",
        attachmentPath: pdfPath,
      });

      // ✅ Delete PDF after sending
      fs.unlinkSync(pdfPath);

    } catch (emailError) {
      console.error("Email Error:", emailError);
      // ❗ Don't fail booking if email fails
    }

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Payment successful & receipt sent",
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
/* ================= GET ALL BOOKINGS (ADMIN) ================= */

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("room")
      .populate("bed")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
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
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("user", "name email")
      .populate("room")
      .populate("bed");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Prevent cancelling twice
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled"
      });
    }

    /* REFUND LOGIC */

    if (booking.paymentStatus === "paid" && booking.paymentId) {

      // prevent double refund
      if (booking.refundStatus === "refunded") {
        return res.status(400).json({
          success: false,
          message: "Refund already processed"
        });
      }

      try {

        const refund = await razorpay.payments.refund(
          booking.paymentId,
          {
            amount: booking.amount * 100
          }
        );

        booking.paymentStatus = "refunded";
        booking.refundStatus = "refunded";
        booking.refundId = refund.id;
        booking.refundedAt = new Date();

      } catch (error) {

        // Razorpay sometimes returns this if already refunded
        if (
          error?.error?.description ===
          "The payment has been fully refunded already"
        ) {
          booking.paymentStatus = "refunded";
          booking.refundStatus = "refunded";
        } else {
          throw error;
        }

      }
    }

    /* UPDATE BOOKING STATUS */

    booking.bookingStatus = "cancelled";
    booking.cancelledAt = new Date();

    if (req.body.reason) {
      booking.cancellationReason = req.body.reason;
    }

    await booking.save();

    /* REALTIME UPDATE */

    if (global.io) {
      global.io.emit("bedBooked");
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });

  } catch (error) {

    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking",
      error: error.message
    });

  }
};

exports.getMyBookings = async (req, res) => {
  try {
    // 1️⃣ Check authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // 2️⃣ Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // 3️⃣ Fetch bookings
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room", "roomNumber price")
      .populate("bed", "bedNumber image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 4️⃣ Total count
    const totalBookings = await Booking.countDocuments({ user: req.user._id });

    // 5️⃣ Booking status summary (useful for dashboard)
    const statusSummary = await Booking.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalBookings,
      totalPages: Math.ceil(totalBookings / limit),
      statusSummary,
      data: bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
      error: error.message,
    });
  }
};




exports.refundBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate Booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Booking ID"
      });
    }

    const booking = await Booking.findById(id);

    // 2️⃣ Booking existence check
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // 3️⃣ Ensure payment was actually completed
    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Refund not allowed. Payment not completed."
      });
    }

    // 4️⃣ Prevent duplicate refund
    if (booking.refundStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Refund already processed"
      });
    }

    // 5️⃣ Razorpay refund
    const refund = await razorpay.payments.refund(
      booking.paymentId,
      {
        amount: booking.amount * 100 // Razorpay works in paise
      }
    );

    // 6️⃣ Update booking fields
    booking.paymentStatus = "refunded";
    booking.refundStatus = "refunded";
    booking.refundId = refund.id;
    booking.refundedAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refundId: refund.id,
        amount: booking.amount
      }
    });

  } catch (error) {

    console.error("Refund Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while processing refund",
      error: error.message
    });
  }
};