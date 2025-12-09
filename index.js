const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
dotenv.config();

const app = express();
const server = http.createServer(app);  // IMPORTANT for Socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // if you are sending cookies/auth headers
}));
// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Swagger ----------
let swaggerDocument;
try {
  swaggerDocument = require("./utils/swagger-output.json");
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log("Swagger documentation not found. Run 'node utils/swagger.js' to generate it.");
}

// ---------- Static Uploads ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Import Routes ----------
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const notesRoutes = require('./routes/notesRoute');
const postRoutes = require('./routes/postRoute');
const chatRoutes = require('./routes/chatRoute');
const messageRoutes = require('./routes/messageRoute');
const zegoRoutes = require('./routes/zegoRoute');

// ---------- Register Routes ----------
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/zego', zegoRoutes);

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// -----------------------------------------
//            🔥 SOCKET.IO SETUP
// -----------------------------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log("User joined chat:", chatId);
  });

  // Send + broadcast message
  socket.on("send_message", (message) => {
    io.to(message.chat).emit("receive_message", message);
  });

  // Typing indicators (broadcast to everyone else in the room)
  socket.on("typing", ({ chatId, user }) => {
    if (!chatId) return;
    socket.to(chatId).emit("typing", { chatId, user });
  });

  socket.on("stop_typing", ({ chatId, user }) => {
    if (!chatId) return;
    socket.to(chatId).emit("stop_typing", { chatId, user });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Make IO available in controllers if needed
app.set("io", io);

// -----------------------------------------
//            🔥 MONGO CONNECTION
// -----------------------------------------
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log("MongoDB connection successful");

    server.listen(PORT, () => {           // IMPORTANT: server.listen (not app.listen)
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO ERROR:", err);
    process.exit(1);
  });
