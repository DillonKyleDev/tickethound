const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../auth')


router.get('/', isLoggedIn, (request, response) => {
  response.redirect('/');
});

module.exports = router;