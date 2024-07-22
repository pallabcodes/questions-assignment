// # This is for custom logger utility

const winston = require('winston');
const { format, createLogger, transports } = winston;

// Define custom formats
const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(), // Add timestamp to logs
    format.errors({ stack: true }), // Log stack traces for errors
    customFormat // Custom format defined above
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Add colors to logs in the console
        customFormat
      )
    }),
    new transports.File({
      filename: 'combined.log', // Log file for general logs
      format: format.combine(
        format.timestamp(),
        format.json() // Store logs in JSON format
      )
    }),
    new transports.File({
      filename: 'error.log', // Log file for errors
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

module.exports = logger;
