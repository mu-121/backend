const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalname: String,
  filename: String,
  filepath: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UploadedFile", fileSchema);
