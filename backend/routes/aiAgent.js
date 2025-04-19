const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { chatWithAI } = require('../controllers/aiAgentController');

router.post('/chat', authMiddleware, roleMiddleware(['member']), chatWithAI);

module.exports = router;