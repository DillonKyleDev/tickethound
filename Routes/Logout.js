const express = require('express');
const router = express.Router();
router.use(express.json({limit: '1mb'}));
router.use(express.urlencoded({ extended: true }));


router.get('/', (req, res) => {
  req.logout();
  res.send('logged out');
});


module.exports = router;