const passport = require('passport');

const localAuthGuard = (req, res, next) => {
  // passport.authenticate will return an express route handler and it requires 3 argument as provided below
  const handler = passport.authenticate(
    'local',
    { session: false },
    (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          message: info?.msg || 'Provide email and password fields correctly',
        });
      }

      return next();
    }
  );

  return handler(req, res, next);
};

module.exports = { localAuthGuard };
