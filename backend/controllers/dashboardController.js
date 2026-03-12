const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Booking = require("../models/Booking");

exports.getDashboardStats = async (req, res) => {
  try {

    const totalRooms = await Room.countDocuments();
    const totalBeds = await Bed.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const revenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      totalRooms,
      totalBeds,
      totalBookings,
      revenue
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats"
    });
  }
};