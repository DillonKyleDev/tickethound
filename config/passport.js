const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../Models/user');
const bcrypt = require('bcrypt');

const options = {
  usernameField: 'email'
};

const verifyCallback = (email, password, done) => {
  console.log('in Verify callback');
  User.findOne({email: email})
  .then(async user => {
    if(!user) {
      console.log('Email or password is incorrect.')
      return done(null, false);
    }
    const isValid = await bcrypt.compare(password, user.password);
    if(isValid) { 
      console.log('Successfully logged in!');
      return done(null, user);
    } else {
      console.log('Email or password is incorrect.')
      return done(null, false);
    }
  });
};

const localStrategy = new LocalStrategy(options, verifyCallback);
passport.use(localStrategy);

passport.serializeUser((user, done) => {
  console.log('In Serialize.');
  done(null, user.id);
});
passport.deserializeUser((userId, done) => {
  console.log('In Deserialize.');
  User.findById(userId)
  .then(user => {
    done(null, user);
  })
  .catch(err => done(err));
});