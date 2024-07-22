const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');
const mongoose = require('mongoose');

// it just extracts "bearer token" from header then verify that with the given secret here
passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_IS,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
          return done(new Error('User IS not found'));
        }

        const user = await User.findOne(
          {
            _id: payload.userId,
            accountStatus: {
              $nin: ['deleted', 'request-for-deletion', 'suspended'],
            },
          },
          {
            password: 0,
            __v: 0,
          }
        );

        if (!user) return done(new Error('User not found'));
        // whatever user's value here is now will be available on req.user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
