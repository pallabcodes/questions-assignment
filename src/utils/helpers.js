const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { UserToken } = require('../models');

// Store hashed token in the database
const hashRefreshToken = async (token) => {
  const saltRounds = 12;
  return await bcrypt.hash(token, saltRounds);
};

const generateNewTokens = async (user, generateNewRefreshToken = true) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET_IS,
    {
      expiresIn: '15m', // Adjust as needed
      algorithm: 'HS256',
    }
  );

  let refreshToken = null;

  if (generateNewRefreshToken) {
    refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET_IS,
      {
        expiresIn: '7d', // Adjust as needed
        algorithm: 'HS256',
      }
    );

    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    // Store the new refresh token in the database with an expiry time
    const tokenDoc = new UserToken({
      userId: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await tokenDoc.save();
  }

  return { accessToken, refreshToken };
};

// Middleware to verify JWT
const verifyJwt = (req, res, next) => {
  const accessToken = req.headers['authorization'];

  if (!accessToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_IS,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'This is Invalid token' });
      }
      // Ensure decoded.sub is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
        return res.status(403).json({ message: 'Invalid ObjectId' });
      }

      // or req.user = { id: decoded.sub, ...other data }
      req.user = decoded?.userId;
      next();
    }
  );
};

const gracefulShutdownHandler = (server) => {
  console.log('Received kill signal, shutting down gracefully...');
  server.close(() => {
    console.log('Closed out remaining connections.');

    // Close MongoDB connection before exiting
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0); // Exit with success code
    });
  });

  // Force shutdown after 10 seconds if connections are not closed
  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

module.exports = { verifyJwt, generateNewTokens, gracefulShutdownHandler };
