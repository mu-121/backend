const express = require("express");
const { issueToken } = require("../Controllers/zegoController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/token", authMiddleware, issueToken);

module.exports = router;

