const express = require("express");

const {
  getBedsByRoom,
  createBed,
  deleteBed,
  getSingleBed,
  updateBed
} = require("../controllers/bedController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer middleware



const router = express.Router();
router.get("/room/:roomId", getBedsByRoom);
router.get("/:id", getSingleBed);
router.post("/create", protect, adminOnly, upload.single("image"), createBed);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBed);
router.delete("/:id", protect, adminOnly, deleteBed);
module.exports = router;