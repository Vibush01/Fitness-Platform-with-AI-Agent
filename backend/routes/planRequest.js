const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { requestPlan, getPlanRequests, approvePlanRequest, rejectPlanRequest } = require('../controllers/planRequestController');

router.post('/request', authMiddleware, roleMiddleware(['member']), requestPlan);
router.get('/requests', authMiddleware, roleMiddleware(['member', 'trainer']), getPlanRequests);
router.post('/approve', authMiddleware, roleMiddleware(['trainer']), approvePlanRequest);
router.post('/reject', authMiddleware, roleMiddleware(['trainer']), rejectPlanRequest);

module.exports = router;