const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOtp");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Handle empty result
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.error("Get Users Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error while fetching users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // 1️⃣ Check authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // 2️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // 3️⃣ Fetch user (exclude sensitive fields)
    const user = await User.findById(req.user._id)
      .select("-password -__v")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4️⃣ Optional: add computed fields (example)
    user.isVerified = !!user.emailVerified; // example flag

    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};


exports.uploadAvatar = async (req, res) => {
  try {
    // 1. Check if user exists in request (auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // 2. Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 3. Find user in DB
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Update avatar
    user.avatar = req.file.path;

    await user.save();

    // 5. Success response
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    // 6. Handle multer errors specifically
    if (error.name === "MulterError") {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: error.message,
      });
    }

    // 7. Handle generic errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // 2. Check auth user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // 5. Prevent same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    // 6. Set new password (assuming pre-save hook hashes it)
    user.password = newPassword;

    await user.save();

    // 7. Success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Update fields safely
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message, // ✅ REAL ERROR MESSAGE
    });
  }
};

exports.requestPasswordChange = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "🔐 Password Change OTP",
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial">
          <h2>Password Change Request</h2>
          <p>Your OTP is:</p>
          <h1 style="color:blue">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


exports.verifyPasswordChange = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "OTP and new password required",
      });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};