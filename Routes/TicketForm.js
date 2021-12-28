const express = require('express');
const router = express.Router();
const Project = require('../Models/project');
router.use(express.json({limit: '1mb'}));
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  const project = await Project.findOne({projectName: req.body.associatedProject});
  const ticket = {
    ticketName: req.body.ticketName,
    associatedProject: req.body.associatedProject,
    description: req.body.description,
    ticketType: req.body.ticketType,
    priority: req.body.priority,
    userAssigned: req.body.userAssigned,
    ticketSubmitter: req.body.ticketSubmitter,
    comments: req.body.comments,
    dateSubmitted: req.body.dateSubmitted,
    timeSubmitted: req.body.timeSubmitted,
    isComplete: false,
    editsArray: []
  };
  project.tickets.push(ticket);
  project.usersAssigned.forEach(user => {
    if(user !== req.body.userAssigned) {
      project.usersAssigned.push(req.body.userAssigned);
    };
  });
  project.save()
  .then(() => {
    res.send('Success');
  })
  .catch(err => {
    console.log(err);
    res.send('An error occured.');
  });
});

module.exports = router;