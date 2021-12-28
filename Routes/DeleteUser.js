const express = require('express');
const router = express.Router();
const User = require('../Models/user');

router.post('/', (req, res) => {
  User.deleteOne({ email: req.body.email}, err => {
    if(err) {
      res.send(err);
    } else {
      res.send('Success.');
    }
  });
});

module.exports = router;