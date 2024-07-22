const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const allRoutes = require('./routes');
const errorHandler = require('./middlewares/errorMiddleware');

require('./strategies/localStrategy');
require('./strategies/jwtStrategy');

const app = express();

const assetsDirectory = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(assetsDirectory));

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(passport.initialize());

app.use('/api', allRoutes);

app.use(errorHandler);

module.exports = app;
