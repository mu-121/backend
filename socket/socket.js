module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    // send message
    socket.on("send_message", (message) => {
      io.to(message.chat).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
