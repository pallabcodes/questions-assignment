const router = require('express').Router();
const CategoryController = require('../controllers/category-controller');

/**
 * @desc   Get an categories info
 * @route  GET /api/categories
 * @access Public
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @desc   Get an categories info
 * @route  GET /api/categories/:id
 * @access Public
 */
router.get('/:id', CategoryController.getCategory);

module.exports = router;
