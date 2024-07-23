const router = require('express').Router();
const upload = require('../config/multer.config');
const UserController = require('../controllers/user-controller');
const { jwtAuthGuard } = require('../middlewares/jwtAuthGuard');

/**
 * @desc   Get an user's info
 * @route  GET /api/users/:id
 * @access Private
 */
router.get('/me', jwtAuthGuard, UserController.getUserProfile);

/**
 * @desc   Update a user's info (including photo)
 * @route  PATCH /api/users/:id
 * @access Private
 */
router.patch(
  '/:id',
  jwtAuthGuard,
  upload.single('avatar'),
  UserController.updateMyProfile
);

/**
 * @desc   Update a user's info (including photo)
 * @route  DELETE /api/users/:id
 * @access Private
 */
router.delete('/:id', jwtAuthGuard, UserController.deleteUserAccount);

module.exports = router;
