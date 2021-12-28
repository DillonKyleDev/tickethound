const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const bcrypt = require('bcrypt');


router.post('/', (req, res) => {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      accountType: req.body.accountType,
      canCreateProjects: req.body.canCreateProjects,
      canAssignUsers: req.body.canAssignUsers,
    });
    user.save()
    .then(() => {
      res.send('User saved to MongoDB.');
    })
    .catch(err => {
      console.log(err);
    });
  });
});

module.exports = router;