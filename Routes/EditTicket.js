const express = require('express');
const router = express.Router();
const Project = require('../Models/project');

router.post('/', (req, res) => {
  Project.findOne({ projectName: req.body.associatedProject }, (err, project) => {
    if(err) {
      console.log(err);
    } else {
      project.tickets.forEach(ticket => {
        if(ticket.ticketName === req.body.ticketName) {
          ticket.editsArray.push({
            oldTicketType: ticket.ticketType,
            newTicketType: req.body.ticketType,
            oldPriority: ticket.priority,
            newPriority: req.body.priority,
            oldUserAssigned: ticket.userAssigned,
            newUserAssigned: req.body.userAssigned,
            oldStatus: ticket.isComplete,
            newStatus: req.body.isComplete,
            dateOfEdit: req.body.dateSubmitted,
            timeOfEdit: req.body.timeSubmitted,
            ticketEditor: req.body.ticketEditor,
            editComment: req.body.comments
          });
          ticket.ticketType = req.body.ticketType;
          ticket.priority = req.body.priority;
          ticket.userAssigned = req.body.userAssigned;
          ticket.isComplete = req.body.isComplete;

          let isNew = true;
          project.usersAssigned.forEach(user => {
            if(user === req.body.userAssigned) {
              isNew = false;
            };
          });
          if(isNew) {
            project.usersAssigned.push(req.body.userAssigned);
          }

          project.markModified('tickets');
          project.save()
          .then(() => {
            res.send('Success.');
          })
          .catch(err => {
            res.send(err);
          });
        };
      });
    };
  })
});

module.exports = router;