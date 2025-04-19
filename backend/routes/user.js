const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { getGyms, getGymDetails, joinGymRequest } = require('../controllers/userController');

router.get('/gyms', authMiddleware, roleMiddleware(['trainer', 'member']), getGyms);
router.get('/gyms/:gymId', authMiddleware, roleMiddleware(['trainer', 'member']), getGymDetails);
router.post('/join-gym', authMiddleware, roleMiddleware(['trainer', 'member']), joinGymRequest);

module.exports = router;