const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { submitContactForm, getContactSubmissions } = require('../controllers/contactController');

router.post('/submit', submitContactForm);
router.get('/submissions', authMiddleware, roleMiddleware(['admin']), getContactSubmissions);

module.exports = router;