function isLoggedIn (req, res, done) {
  if(req.user) {
    console.log("is logged in")
    done();
  } else {
    console.log("Not logged in")
    res.redirect('/');
  }
};

module.exports = { isLoggedIn }