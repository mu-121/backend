const express = require("express");
const router = express.Router();
const { uploadFile, uploadMultipleFiles,} = require("../Controllers/uploadController");
const upload = require("../middleware/upload");


router.post("/file", upload.single("file"), uploadFile);


router.post("/multipleFiles", upload.array("files", 10), uploadMultipleFiles);


module.exports = router;