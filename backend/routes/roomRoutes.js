const express = require("express");

const {
  createRoom,
  getRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms
} = require("../controllers/roomController");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ADMIN ONLY ROUTES
// Create Room
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "bedImages", maxCount: 20 }
  ]),
  createRoom
);
// Update Room
router.put("/:id", protect, adminOnly, updateRoom);

// Delete Room
router.delete("/:id", protect, adminOnly, deleteRoom);


// PUBLIC ROUTES
router.get("/available", getAvailableRooms); 
// Get All Rooms
router.get("/", getRooms);

// Get Single Room
router.get("/:id", getSingleRoom);

module.exports = router;