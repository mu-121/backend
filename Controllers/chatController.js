const Chat = require("../models/Chat");
const User = require("../models/userModal");

// Create or return existing chat
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      users: { $all: [req.user.id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) return res.json(chat);

    // Create new chat
    const newChat = await Chat.create({
      users: [req.user.id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all chats
exports.fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.user.id] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
