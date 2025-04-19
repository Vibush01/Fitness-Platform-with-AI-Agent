const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { logBodyProgress, getBodyProgress, editBodyProgress } = require('../controllers/bodyProgressController');

// Import gymController for getTrainers
const { getTrainers } = require('../controllers/gymController');

router.post('/log', authMiddleware, roleMiddleware(['member']), logBodyProgress);
router.get('/logs', authMiddleware, roleMiddleware(['member']), getBodyProgress);
router.put('/edit', authMiddleware, roleMiddleware(['member']), editBodyProgress);

// Add route for fetching trainers (moved from gym.js to allow members and trainers to access)
router.get('/trainers/:gymId', authMiddleware, roleMiddleware(['gym', 'member', 'trainer']), getTrainers);

module.exports = router;