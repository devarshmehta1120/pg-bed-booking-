const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Booking = require("../models/Booking");

exports.getDashboardStats = async (req, res) => {
  try {

    // Count documents
    const totalRooms = await Room.countDocuments();
    const totalBeds = await Bed.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate revenue
    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      stats: {
        totalRooms,
        totalBeds,
        totalBookings,
        revenue
      }
    });

  } catch (error) {

    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard statistics"
    });

  }
};