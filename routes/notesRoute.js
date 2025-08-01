const express = require("express");
const router = express.Router();
const { createNote, getNotes, updateNote, deleteNote, getNoteById } = require("../Controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Create a new note
router.post("/create", createNote);

// Get all notes for the authenticated user
router.get("/getnotes", getNotes);

// Get a specific note by ID
router.get("/note/:id", getNoteById);

// Update a note
router.put("/updateNote/:id", updateNote);

// Delete a note
router.delete("/deleteNote/:id", deleteNote);

module.exports = router;
