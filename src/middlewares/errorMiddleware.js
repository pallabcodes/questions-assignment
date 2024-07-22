const errorHandler = (err, req, res, next) => {
  // Determine the status code (default to 500 if not specified)
  const statusCode = err.status || 500;

  // Send error response
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
  });
};

module.exports = errorHandler;
