const express = require('express');
const router = express.Router();
const squadController = require('../controllers/squad.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/search', squadController.search);
router.post('/join-by-code', squadController.joinByCode);

router.get('/', squadController.getAll);
router.post('/', squadController.create);
router.get('/:id', squadController.getById);
router.put('/:id', squadController.update);
router.delete('/:id', squadController.delete);

router.get('/:id/members', squadController.getMembers);
router.post('/:id/join', squadController.join);
router.post('/:id/leave', squadController.leave);
router.post('/:id/invite', squadController.invite);
router.delete('/:id/members/:userId', squadController.removeMember);
router.put('/:id/members/:userId/role', squadController.updateMemberRole);

router.get('/:id/stats', squadController.getStats);

module.exports = router;
