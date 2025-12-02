const Message = require("../models/Message");
const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let message = await Message.create({
      sender: req.user.id,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "name email avatar");
    message = await message.populate("chat");
    message = await message.populate({
      path: "chat",
      populate: { path: "users", select: "name email avatar" },
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name email avatar")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
