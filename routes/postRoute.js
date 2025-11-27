const express = require("express");
const { createPost, getPosts } = require("../Controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.use(authMiddleware);
router.post("/createPost", createPost);
router.get("/getPosts", getPosts);
module.exports = router;