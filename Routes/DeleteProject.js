const express = require('express');
const router = express.Router();
const Project = require('../Models/project');

router.post('/', (req, res) => {
  Project.deleteOne({ projectName: req.body.projectName}, err => {
    if(err) {
      res.send(err);
    } else {
      res.send('Success.');
    }
  });
});

module.exports = router;