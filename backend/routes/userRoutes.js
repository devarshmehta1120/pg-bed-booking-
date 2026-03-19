const express = require("express");

const {
  getProfile,
  uploadAvatar,
  changePassword,
  getAllUsers,
  updateProfile,
  requestPasswordChange,
  verifyPasswordChange,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* ================= USER PROFILE ================= */

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Upload avatar
router.post(
  "/upload-avatar",
  protect,
  upload.single("image"),
  uploadAvatar
);

// Change password (normal)
router.put("/change-password", protect, changePassword);

/* ================= PASSWORD CHANGE (OTP) ================= */

// Send OTP
router.post("/request-password-change", protect, requestPasswordChange);

// Verify OTP + change password
router.post("/verify-password-change", protect, verifyPasswordChange);

/* ================= ADMIN ================= */

// Get all users (admin only)
router.get("/", protect, adminOnly, getAllUsers);

module.exports = router;