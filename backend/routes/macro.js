const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { logMacro, editMacro, deleteMacro, getMacroLogs } = require('../controllers/macroController');

router.post('/log', authMiddleware, roleMiddleware(['member']), logMacro);
router.put('/edit', authMiddleware, roleMiddleware(['member']), editMacro);
router.delete('/delete', authMiddleware, roleMiddleware(['member']), deleteMacro);
router.get('/logs', authMiddleware, roleMiddleware(['member']), getMacroLogs);

module.exports = router;