const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth-controller');
const { jwtAuthGuard } = require('../middlewares/jwtAuthGuard');
const { localAuthGuard } = require('../middlewares/localAuthGuard');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
router.post('/register', AuthController.register);

/**
 * @desc   Login user
 * @route  POST /api/auth/login
 * @access Public
 */
router.post('/login', localAuthGuard, AuthController.login);

/**
 * @desc   Logging Out
 * @route  POST /api/auth/logout
 * @access Private
 */
router.post('/logout', jwtAuthGuard, AuthController.logout);

module.exports = router;
