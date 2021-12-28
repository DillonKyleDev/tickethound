const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/user');


router.post('/', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.accountType = req.body.accountType;
  user.canCreateProjects = req.body.canCreateProjects;
  user.canAssignUsers = req.body.canAssignUsers;
  if(req.body.password !== null) {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      user.password = hash;
      user.save()
      .then(() => {
        res.send('Success.');
      })
      .catch(err => {
        console.log(err);
      });
    });
  } else {
    user.save()
    .then(() => {
      res.send('Success.');
    })
    .catch(err => {
      console.log(err);
    });
  };
});

module.exports = router;