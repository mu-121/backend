const Project = require("../models/projectModal");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }
    
    const project = new Project({ 
      name, 
      description, 
      user: req.user._id 
    });
    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Error creating project" });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Error getting projects" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const project = await Project.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name, description },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({ _id: id, user: req.user._id });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error("Get project by ID error:", error);
    res.status(500).json({ message: "Error getting project" });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
};