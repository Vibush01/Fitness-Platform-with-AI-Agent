const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { chatWithAI, getAIChatHistory } = require('../controllers/aiAgentController');

router.post('/chat', authMiddleware, roleMiddleware(['member']), chatWithAI);
router.get('/history', authMiddleware, roleMiddleware(['member']), getAIChatHistory);

module.exports = router;