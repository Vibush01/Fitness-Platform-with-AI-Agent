const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/chatController');

router.post('/send', authMiddleware, roleMiddleware(['gym', 'trainer', 'member']), sendMessage);
router.get('/messages/:otherUserId', authMiddleware, roleMiddleware(['gym', 'trainer', 'member']), getMessages);

module.exports = router;