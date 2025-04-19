const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { logBodyProgress, getBodyProgress } = require('../controllers/bodyProgressController');

router.post('/log', authMiddleware, roleMiddleware(['member']), logBodyProgress);
router.get('/logs', authMiddleware, roleMiddleware(['member']), getBodyProgress);

module.exports = router;