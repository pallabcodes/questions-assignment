const rateLimit = require('express-rate-limit');

// Created a rate limiter for the refresh token route
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user-agent to 5 requests per windowMs
  keyGenerator: (req) => req.headers['user-agent'], // Use user-agent for rate limiting
  message: 'Too many requests from this user-agent, please try again later.',
});

// Create a rate limiter for the refresh token route
const hourlyRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 5, // Limit each IP address to 5 requests per hour
  message: 'Too many requests from this IP, please try again later.',
  keyGenerator: (req) => req.ip, // Use IP address for rate limiting
});

module.exports = { refreshTokenLimiter, hourlyRateLimiter };
