const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { updateProfile, getProfile } = require('../controllers/profileController');

router.put('/update', authMiddleware, updateProfile);
router.get('/', authMiddleware, getProfile);

module.exports = router;