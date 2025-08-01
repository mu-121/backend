const Note = require("../models/notesModal");

const createNote = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newNote = await Note.create({
      title,
      content,
      image: image || null,
      user: req.user._id, 
    });

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Failed to create note" });
  }
};

const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10;  
    const skip = (page - 1) * limit;
    const searchKeyword = req.query.search || "";

    const filter = {
      user: req.user._id,
      $or: [
        { title: { $regex: searchKeyword, $options: "i" } },
        { content: { $regex: searchKeyword, $options: "i" } },
      ]
    };

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Failed to get notes" });
  }
};


const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, image },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOne({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({ message: "Failed to get note" });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote, getNoteById };
