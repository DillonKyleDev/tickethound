const express = require('express');
const router = express.Router();
const Project = require('../Models/project');

router.post('/', (req, res) => {
  Project.findOne({ projectName: req.body.projectName }, (err, project) => {
    if(err) {
      console.log(err);
      res.send('Error Occured');
    }
    console.log(req.body.projectDescription);
    project.projectDescription = req.body.projectDescription;
    project.save(err => {
      if(err) {
        console.log(err);
        res.send('Error occurred.');
      }
      res.send('Saved successfully.');
    
    })
  });
});

module.exports = router;