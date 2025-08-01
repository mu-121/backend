const express = require("express");
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject, getProjectById } = require("../Controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Create a new project
router.post("/create", createProject);

// Get all projects for the authenticated user
router.get("/getProjects", getProjects);

// Get a specific project by ID
router.get("/project/:id", getProjectById);

// Update a project
router.put("/updateProject/:id", updateProject);

// Delete a project
router.delete("/deleteProject/:id", deleteProject);

module.exports = router;