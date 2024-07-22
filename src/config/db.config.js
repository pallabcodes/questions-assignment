const mongoose = require('mongoose');

const initializeDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI);
};

module.exports = initializeDatabase;
