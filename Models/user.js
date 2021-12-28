const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: false,
    default: 'Submitter'
    //Types: Admin, Project_Manager, Developer, Submitter
  },
  projectsAssigned: {
    type: Array,
    required: false,
    default: [ 'No projects assigned.']
  },
  canCreateProjects: {
    type: Boolean,
    required: false,
    default: false
  },
  canAssignUsers: {
    type: Boolean,
    required: false,
    default: false
  },

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;