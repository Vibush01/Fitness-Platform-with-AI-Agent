const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');

router.post('/create', authMiddleware, roleMiddleware(['gym']), createAnnouncement);
router.get('/list', authMiddleware, roleMiddleware(['member', 'trainer']), getAnnouncements);

module.exports = router;