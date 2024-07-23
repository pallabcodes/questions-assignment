const router = require('express').Router();
const QuestionController = require('../controllers/question-controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { jwtAuthGuard } = require('../middlewares/jwtAuthGuard');

/**
 * @desc   Get questions by category or categories
 * @route  GET /api/questions
 * @access Private
 */

router.get('/', jwtAuthGuard, QuestionController.getQuestionsForEachCategory);


/**
 * @desc   Create questions in bulk from a csv file
 * @route  POST /api/questions/bulk-import
 * @access Private
 */

router.post(
  '/bulk-import',
  jwtAuthGuard,
  upload.single('file'),
  QuestionController.bulkImportQuestions
);

module.exports = router;
