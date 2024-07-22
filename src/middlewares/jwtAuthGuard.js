const passport = require('passport');

const jwtAuthGuard = (req, res, next) => {
  // passport.authenticate will return an express route handler and it requires 3 argument as provided below
  const handler = passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          message: info?.msg || 'Token could be either invalid or expired',
        });
      }

      req.user = user;

      return next();
    }
  );

  return handler(req, res, next);
};

module.exports = { jwtAuthGuard };
