const router = require('express').Router();
const QuestionController = require('../controllers/question-controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { jwtAuthGuard } = require('../middlewares/jwtAuthGuard');

router.get('/', jwtAuthGuard, QuestionController.getQuestionsForEachCategory);

router.post(
  '/bulk-import',
  jwtAuthGuard,
  upload.single('file'),
  QuestionController.bulkImportQuestions
);

module.exports = router;
