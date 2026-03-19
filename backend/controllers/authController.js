const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const generateToken = require("../utils/generateToken");


/* ================= REGISTER USER ================= */

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("Register Error:", error);

    // ✅ Handle duplicate key error (VERY IMPORTANT)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration"
    });
  }
};



/* ================= LOGIN USER ================= */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error during login"
    });
  }
};



/* ================= GET USER PROFILE ================= */

exports.getProfile = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching profile"
    });
  }
};

// exports.refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     // 1. Validate input
//     if (!refreshToken) {
//       return res.status(400).json({
//         success: false,
//         message: "Refresh token is required",
//       });
//     }

//     // 2. Check env variables
//     if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
//       console.error("JWT secrets are not defined in environment variables");
//       return res.status(500).json({
//         success: false,
//         message: "Server configuration error",
//       });
//     }

//     let decoded;

//     // 3. Verify refresh token
//     try {
//       decoded = jwt.verify(
//         refreshToken,
//         process.env.JWT_REFRESH_SECRET
//       );
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({
//           success: false,
//           message: "Refresh token expired",
//         });
//       }

//       if (err.name === "JsonWebTokenError") {
//         return res.status(403).json({
//           success: false,
//           message: "Invalid refresh token",
//         });
//       }

//       // Unknown JWT error
//       console.error("JWT verification error:", err);
//       return res.status(500).json({
//         success: false,
//         message: "Token verification failed",
//       });
//     }

//     // 4. Validate decoded payload
//     if (!decoded || !decoded.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid token payload",
//       });
//     }

//     // 5. Generate new tokens
//     const newAccessToken = jwt.sign(
//       { id: decoded.id },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     const newRefreshToken = jwt.sign(
//       { id: decoded.id },
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: "7d" }
//     );

//     // 6. Send response
//     return res.status(200).json({
//       success: true,
//       token: newAccessToken,
//       refreshToken: newRefreshToken,
//     });

//   } catch (error) {
//     // 7. Catch unexpected errors
//     console.error("Refresh token controller error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };