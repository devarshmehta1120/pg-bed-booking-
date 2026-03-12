const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Booking = require("../models/Booking");
/* ================= CREATE ROOM ================= */

exports.createRoom = async (req, res) => {

  try {

    const { roomNumber, totalBeds, pricePerBed } = req.body;

    if (!roomNumber || !totalBeds || !pricePerBed) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room already exists"
      });
    }

    /* ================= GET IMAGES ================= */

    const images =
  req.files?.images?.map(file => `/uploads/${file.filename}`) || [];

    const room = await Room.create({
      roomNumber,
      totalBeds,
      pricePerBed,
      images
    });

    /* ===== AUTO CREATE BEDS ===== */
const bedImages =
  req.files?.bedImages?.map(file => `/uploads/${file.filename}`) || [];

  const beds = [];


for (let i = 1; i <= totalBeds; i++) {

  let imagePath = null;

  if (bedImages[i - 1]) {
    imagePath = bedImages[i - 1];   // ✅ already correct path
  }

  beds.push({
    room: room._id,
    bedNumber: `Bed-${i}`,
    image: imagePath
  });

}

await Bed.insertMany(beds);

    res.status(201).json({
      success: true,
      message: "Room and beds created successfully",
      data: room
    });

  } catch (error) {

    console.error("Create Room Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating room"
    });

  }
};
// GET ALL ROOMS
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({
      success: true,
      data: rooms
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// GET SINGLE ROOM
exports.getSingleRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// UPDATE ROOM
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated",
      data: room
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// DELETE ROOM
exports.deleteRoom = async (req, res) => {
  try {

    const roomId = req.params.id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    /* ===== DELETE ALL BEDS OF THIS ROOM ===== */

    await Bed.deleteMany({ room: roomId });

    /* ===== DELETE ROOM ===== */

    await Room.findByIdAndDelete(roomId);

    res.status(200).json({
      success: true,
      message: "Room and its beds deleted successfully"
    });

  } catch (error) {

    console.error("Delete Room Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

exports.getAvailableRooms = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;

    /* ===== VALIDATE INPUT ===== */

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date"
      });
    }

    /* ===== FIND BOOKINGS THAT OVERLAP ===== */

    const bookings = await Booking.find({
      status: { $in: ["paid", "booked"] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    }).select("bed");

    /* ===== GET BOOKED BED IDS ===== */

    const bookedBedIds = bookings.map(b => b.bed.toString());

    /* ===== FIND AVAILABLE BEDS ===== */

    const beds = await Bed.find({
      _id: { $nin: bookedBedIds }
    }).populate("room", "roomNumber pricePerBed");

    res.status(200).json({
      success: true,
      count: beds.length,
      data: beds
    });

  } catch (error) {

  console.error("Available Rooms Error:", error);

  res.status(500).json({
    success: false,
    message: error.message
  });

}
};