const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { updateGymProfile, getJoinRequests, acceptJoinRequest, getMembers, getMemberships } = require('../controllers/gymController');

router.put('/profile', authMiddleware, roleMiddleware(['gym']), updateGymProfile);
router.get('/join-requests', authMiddleware, roleMiddleware(['gym']), getJoinRequests);
router.post('/accept-join', authMiddleware, roleMiddleware(['gym']), acceptJoinRequest);
router.get('/members/:gymId', authMiddleware, roleMiddleware(['gym']), getMembers);
router.get('/memberships/:gymId', authMiddleware, roleMiddleware(['gym']), getMemberships);

module.exports = router;