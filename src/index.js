const path = require('path');

// Configure and load env secrets
const envFilePath = path.join(__dirname, '..', '.env.local');
require('dotenv').config({ path: envFilePath });

// Import application
const app = require('./app');

// Import configurations
const createServer = require('./config/server.config');
const initializeDatabase = require('./config/db.config');

// Helpers
const { gracefulShutdownHandler } = require('./utils/helpers');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Connect to database
    await initializeDatabase();

    // Initialize the server
    const server = createServer(app);

    // Start the server and log the mode (HTTP/HTTPS)
    server.listen(PORT, () => {
      console.log(`HTTP Server is running on port ${PORT}`);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // For kill commands (e.g., from systemd or other process managers)
    process.on('SIGTERM', gracefulShutdownHandler);
    // For interrupt signals (e.g., Ctrl+C from the terminal)
    process.on('SIGINT', gracefulShutdownHandler);
  } catch (error) {
    console.error('Error starting server:', error);
    // Exit with failure code
    process.exit(1);
  }
};

startServer();
