const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', habitController.getAll);
router.post('/', habitController.create);
router.get('/user/:userId', habitController.getByUserId);
router.get('/identity/:identityId', habitController.getByIdentityId);
router.get('/:id', habitController.getById);
router.put('/:id', habitController.update);
router.delete('/:id', habitController.delete);

module.exports = router;
