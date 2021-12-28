const express = require('express');
const router = express.Router();
const Project = require('../Models/project');
router.use(express.json({limit: '1mb'}));
router.use(express.urlencoded({ extended: true }));


router.post('/', (req, res) => {
  Project.find((err, projects) => {
    projects.forEach(project => {
      let userArray = [];
      project.tickets.forEach(ticket => {
        userArray.push(ticket.userAssigned);
      });
      const userSet = [...new Set(userArray)];
      project.usersAssigned = userSet;
      project.markModified('project');
        project.save()
        .catch(err => {
          console.log(err);
        });
    });
    if(err) {
      console.log(err);
      res.json({Message: 'An error occurred.'});
    } else {
      res.json(projects);
    }
  });
});

router.get('/', (request, response) => {
  response.redirect('/');
});

module.exports = router;