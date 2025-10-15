const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const dotenv = require('dotenv');
const swaggerUi = require("swagger-ui-express");
const fs = require('fs');

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

// Swagger setup with error handling
let swaggerDocument;
try {
  swaggerDocument = require("./utils/swagger-output.json");
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log("Swagger documentation not found. Run 'node utils/swagger.js' to generate it.");
}

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
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("Missing MONGODB_URI in environment. Please set it in your .env file.");
  process.exit(1);
}

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection disconnected');
});

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
