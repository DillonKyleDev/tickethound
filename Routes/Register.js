const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/user');
router.use(express.json({limit: '1mb'}));
router.use(express.urlencoded({ extended: true }));
const saltRounds = 10;


router.post('/', (request, response) => {
  bcrypt.hash(request.body.password, saltRounds, (err, hash) => {
    const user = new User({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hash
    });
    user.save()
    .then(() => {
      response.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
  })
});

module.exports = router;