const express = require('express');
const router = express.Router();
const identityController = require('../controllers/identity.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', identityController.getAll);
router.post('/', identityController.create);
router.get('/:id', identityController.getById);
router.put('/:id', identityController.update);
router.delete('/:id', identityController.delete);

module.exports = router;
