const UploadedFile = require("../models/uploadModel");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileDoc = await UploadedFile.create({
      originalname: req.file.originalname,
      filename: req.file.filename,
      filepath: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileDoc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "File upload failed" });
  }
};

const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const fileDocs = await Promise.all(
      req.files.map((file) =>
        UploadedFile.create({
          originalname: file.originalname,
          filename: file.filename,
          filepath: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        })
      )
    );

    res.status(201).json({
      message: "Files uploaded successfully",
      files: fileDocs,
    });
  } catch (err) {
    console.error("Multiple file upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};


module.exports = { 
  uploadFile, 
  uploadMultipleFiles, 
 
};
