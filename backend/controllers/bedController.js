const Bed = require("../models/Bed");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");


/* ================= GET BEDS BY ROOM ================= */

exports.getBedsByRoom = async (req, res) => {
  try {

    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room ID"
      });
    }

    const beds = await Bed.find({ room: roomId })
      .populate("room", "roomNumber pricePerBed");

    const today = new Date();

    const bookings = await Booking.find({
      bookingStatus: { $in: ["pending", "confirmed"] },
      endDate: { $gte: today }
    }).select("bed");

    const bookedBedIds = new Set(
      bookings.map(b => b.bed.toString())
    );

    const bedsWithStatus = beds.map((bed) => {

      const isBooked = bookedBedIds.has(bed._id.toString());

      return {
        ...bed.toObject(),
        isBooked,
        isAvailable: !isBooked
      };

    });

    res.status(200).json({
      success: true,
      count: bedsWithStatus.length,
      data: bedsWithStatus
    });

  } catch (error) {

    console.error("Get Beds By Room Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching beds"
    });

  }
};


/* ================= CREATE BED ================= */


exports.createBed = async (req, res) => {
  try {

    const { room, bedNumber } = req.body;

    // Validate required fields
    if (!room || !bedNumber) {
      return res.status(400).json({
        success: false,
        message: "Room and bed number are required"
      });
    }

    // Validate Room ID
    if (!mongoose.Types.ObjectId.isValid(room)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room ID"
      });
    }

    // Handle image upload
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // Create bed
    const bed = await Bed.create({
      room,
      bedNumber,
      image
    });

    return res.status(201).json({
      success: true,
      message: "Bed created successfully",
      data: bed
    });

  } catch (error) {

    console.error("Create Bed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating bed"
    });

  }
};



/* ================= DELETE BED ================= */

exports.deleteBed = async (req, res) => {
  try {

    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bed ID"
      });
    }

    // Delete Bed
    const bed = await Bed.findByIdAndDelete(id);

    // Bed not found
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found"
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Bed deleted successfully",
      deletedBed: bed
    });

  } catch (error) {

    console.error("Delete Bed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting bed"
    });
  }
};
exports.updateBed = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Bed ID",
      });
    }

    const bed = await Bed.findById(id);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    // Update bed number
    if (req.body.bedNumber) {
      bed.bedNumber = req.body.bedNumber;
    }

    // Update image if file uploaded
    if (req.file) {
      bed.image = `/uploads/${req.file.filename}`;
    }

    const updatedBed = await bed.save();

    res.status(200).json({
      success: true,
      message: "Bed updated successfully",
      data: updatedBed,
    });

  } catch (error) {
    console.error("Update Bed Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating bed",
      error: error.message,
    });
  }
};

  exports.getSingleBed = async (req, res) => {
  try {

    const bed = await Bed.findById(req.params.id)
      .populate("room", "roomNumber pricePerBed");

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found"
      });
    }

    res.status(200).json({
      success: true,
      data: bed
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};
