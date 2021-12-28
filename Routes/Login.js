const express = require('express');
const router = express.Router();
const passport = require('passport');
router.use(express.json({limit: '1mb'}));
router.use(express.urlencoded({ extended: true }));
require('../config/passport');


const options = {
  failureRedirect: '/'
};

router.post('/', passport.authenticate('local', options), (req, res) => {
  const safeUser = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    accountType: req.user.accountType,
    projectsAssigned: req.user.projectsAssigned,
    canCreateProjects: req.user.canCreateProjects,
    canAssignUsers: req.user.canAssignUsers
  }
  res.json({ user: safeUser });
});

module.exports = router;