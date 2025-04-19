const PlanRequest = require('../models/PlanRequest');
const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

const requestPlan = async (req, res) => {
  const { trainerId, type } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const member = await Member.findById(user.profile._id);
    if (!member.gym) {
      return res.status(400).json({ message: 'Member is not part of a gym' });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (!trainer.gym || trainer.gym.toString() !== member.gym.toString()) {
      return res.status(400).json({ message: 'Trainer is not part of your gym' });
    }

    const planRequest = await PlanRequest.create({
      member: member._id,
      trainer: trainerId,
      type,
    });

    res.status(201).json(planRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlanRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let requests;
    if (user.role === 'member') {
      requests = await PlanRequest.find({ member: user.profile._id })
        .populate('trainer')
        .sort({ createdAt: -1 });
    } else if (user.role === 'trainer') {
      requests = await PlanRequest.find({ trainer: user.profile._id })
        .populate('member')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approvePlanRequest = async (req, res) => {
  const { requestId, plan } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'trainer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const planRequest = await PlanRequest.findById(requestId);
    if (!planRequest) {
      return res.status(404).json({ message: 'Plan request not found' });
    }

    if (planRequest.trainer.toString() !== user.profile._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to approve this request' });
    }

    planRequest.status = 'approved';
    planRequest.plan = plan;
    await planRequest.save();

    res.status(200).json(planRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectPlanRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'trainer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const planRequest = await PlanRequest.findById(requestId);
    if (!planRequest) {
      return res.status(404).json({ message: 'Plan request not found' });
    }

    if (planRequest.trainer.toString() !== user.profile._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to reject this request' });
    }

    planRequest.status = 'rejected';
    await planRequest.save();

    res.status(200).json(planRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestPlan, getPlanRequests, approvePlanRequest, rejectPlanRequest };