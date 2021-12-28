const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  usersAssigned: {
    type: Array,
    required: true
    // Users should be inserted via their associated email address
  },
  tickets: {
    type: Array,
    required: false,
    default: []
  }
 }, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;