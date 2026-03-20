const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

// single image upload
router.post("/image", upload.single("image"), (req, res) => {
  try {
    let imageUrl;

    if (process.env.STORAGE_TYPE === "cloud") {
      imageUrl = req.file.path; // Cloudinary URL
    } else {
      imageUrl = `${process.env.FRONTEND_URL}/${req.file.path}`;
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;