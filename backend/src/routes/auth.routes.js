const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', auth, authController.getMe);
router.put('/password', auth, authController.changePassword);

module.exports = router;
