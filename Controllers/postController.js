const { Post } = require("../models/postModal");
const User = require("../models/userModal");

const createPost = async (req, res) => {
  try {
    const { title, content, userId, image } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.create({
      title,
      content,
      user: userId,
      image,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};
module.exports = { createPost, getPosts };
