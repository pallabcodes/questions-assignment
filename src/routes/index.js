const express = require('express');

const AuthRoutes = require('./auth-route');
const UserRoutes = require('./user-route');
const CategoryRoutes = require('./category-route');
const QuestionRoutes = require('./question-route');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);
router.use('/categories', CategoryRoutes);
router.use('/questions', QuestionRoutes);

module.exports = router;
