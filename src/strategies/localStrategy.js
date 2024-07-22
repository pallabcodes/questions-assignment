const passport = require('passport');
const { Strategy } = require('passport-local');
const { User } = require('../models');

// Custom error messages
const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'No user found with this email address.',
  INCORRECT_PASSWORD: 'Incorrect password.',
};

// checking the given password against database is passport-local strategy
passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne(
        { email: email.toLowerCase() },
        { __v: 0 }
      );

      // if (!user) return done('User is not found', null);

      if (!user) {
        return done(new Error(ERROR_MESSAGES.USER_NOT_FOUND));
      }

      const isMatch = await user.comparePassword(password);

      // if (!isMatch) return done('user error', null);

      // Check if password is correct
      if (!isMatch) {
        return done(new Error(ERROR_MESSAGES.INCORRECT_PASSWORD));
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
);
