const express = require("express");

const {
  getBedsByRoom,
  createBed,
  deleteBed,
  getSingleBed
} = require("../controllers/bedController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer middleware



const router = express.Router();

router.get("/room/:roomId", getBedsByRoom);
router.get("/:id", getSingleBed);

// Create bed with image upload
router.post("/create", protect, adminOnly, upload.single("image"), createBed);


router.delete("/:id", protect, adminOnly, deleteBed, getSingleBed);

module.exports = router;