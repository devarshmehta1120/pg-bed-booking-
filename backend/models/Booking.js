const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },

  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed"
  },

  startDate: Date,
  endDate: Date,

  amount: Number,

  status: {
    type: String,
    enum: ["pending", "paid", "booked", "cancelled"],
    default: "pending"
  },

  paymentId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

},
{ timestamps: true }
);

/* Prevent overlapping booking queries */
bookingSchema.index({ bed: 1, startDate: 1, endDate: 1 });

/* TTL index for pending bookings (5 minutes) */
bookingSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 120, partialFilterExpression: { status: "pending" } }
);

module.exports = mongoose.model("Booking", bookingSchema);