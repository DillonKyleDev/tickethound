const express = require('express');
const router = express.Router();
const User = require('../Models/user');

router.post('/', (req, res) => {
  User.find((err, users) => {
    if(err) {
      console.log(err);
      res.json({Message: 'An error occurred.'});
    } else {
      let userArray = [];
      users.forEach(user => {
        const safeUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType,
          projectsAssigned: user.projectsAssigned,
          _id: user._id
        }
        userArray.push(safeUser);
      })
      res.json(userArray);
    };
  });
});

router.get('/', (request, response) => {
  response.redirect('/');
});

module.exports = router;