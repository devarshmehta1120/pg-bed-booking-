const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },

  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed",
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  /* Booking status */

  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  },

  /* Payment status */

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },

  /* Refund status */

  refundStatus: {
    type: String,
    enum: ["none", "pending", "refunded"],
    default: "none"
  },

  /* Payment method */

  paymentMethod: {
    type: String,
    enum: ["razorpay", "cash", "upi"],
    default: "razorpay"
  },

  /* Razorpay ids */

  paymentId: String,
  orderId: String,
  refundId: String,

  /* Tracking dates */

  cancelledAt: Date,
  refundedAt: Date,

  /* Cancellation reason */

  cancellationReason: String,

  /* Optional receipt PDF */

  receipt: String,

  /* Phone number */

  phone: String

},
{ timestamps: true }
);

/* Prevent overlapping bookings */
bookingSchema.index({ bed: 1, startDate: 1, endDate: 1 });

/* Auto-delete unpaid bookings after 5 minutes */
bookingSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60,
    partialFilterExpression: { paymentStatus: "pending" }
  }
);

module.exports = mongoose.model("Booking", bookingSchema);