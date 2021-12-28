const express = require('express');
const router = express.Router();
const Project = require('../Models/project');
router.use(express.json({limit: '1mb'}));
router.use(express.urlencoded({ extended: true }));


router.post('/', (req, res) => {
  const project = new Project({
    projectName: req.body.projectName,
    projectDescription: req.body.projectDescription,
    createdBy: req.body.createdBy,
    usersAssigned: req.body.usersAssigned
  });
  
  project.save()
  .then(() => {
    res.send('Project saved to MongoDB.');
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })
});

module.exports = router;