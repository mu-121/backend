const express = require("express");
const { accessChat, fetchChats } = require("../Controllers/chatController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, fetchChats);

module.exports = router;
