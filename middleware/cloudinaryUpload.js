const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpeg", "jpg", "png", "gif", "pdf", "doc", "docx", "txt"],
  },
});

const upload = multer({ storage });

module.exports = upload;
