const express = require('express');
const router = express.Router();
const completionController = require('../controllers/completion.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', completionController.getAll);
router.post('/', completionController.create);
router.post('/toggle', completionController.toggle);
router.get('/today', completionController.getToday);
router.get('/stats', completionController.getUserStats);
router.get('/habit/:habitId', completionController.getByHabitId);
router.get('/habit/:habitId/stats', completionController.getHabitStats);
router.get('/:id', completionController.getById);
router.put('/:id', completionController.update);
router.delete('/:id', completionController.delete);

module.exports = router;
