const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = 5000;

// Import routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const notesRoutes = require('./routes/notesRoute');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/notes', notesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://usman53307:fAJ5TpEc83jOCKpr@cluster0.pkfrj9c.mongodb.net/testingbackend"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
