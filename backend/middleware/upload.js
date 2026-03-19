const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* ================= CONFIG ================= */

const useCloudinary = process.env.STORAGE_TYPE === "cloud"; // "local" or "cloud"

/* ================= LOCAL STORAGE ================= */

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

/* ================= CLOUDINARY STORAGE ================= */

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const allowedFormats = ["jpg", "jpeg", "png", "webp"];
    const ext = file.mimetype.split("/")[1];

    if (!allowedFormats.includes(ext)) {
      throw new Error("Only JPG, JPEG, PNG, WEBP allowed");
    }

    return {
      folder: `pg-booking/users/${req.user?._id || "guest"}`,

      public_id: `user-${Date.now()}`,

      format: ext,

      transformation: [
        { width: 500, height: 500, crop: "limit" }
      ]
    };
  },
});

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) allowed"));
  }
};

/* ================= MULTER INSTANCE ================= */

const upload = multer({
  storage: useCloudinary ? cloudStorage : localStorage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter,
});

module.exports = upload;