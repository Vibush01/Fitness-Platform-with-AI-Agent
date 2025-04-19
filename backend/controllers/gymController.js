const Gym = require('../models/Gym');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');

const updateGymProfile = async (req, res) => {
  const { name, address, photos, ownerName } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'gym') {
      return res.status(404).json({ message: 'Gym not found' });
    }

    const gym = await Gym.findByIdAndUpdate(
      user.profile._id,
      { name, address, photos, ownerName },
      { new: true }
    );

    res.status(200).json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJoinRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'gym') {
      return res.status(404).json({ message: 'Gym not found' });
    }

    const trainers = await Trainer.find({ gym: null });
    const members = await Member.find({ gym: null });

    res.status(200).json({ trainers, members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptJoinRequest = async (req, res) => {
  const { userType, userId } = req.body; // userType: 'trainer' or 'member'
  const gymUserId = req.user.id;

  try {
    const gymUser = await User.findById(gymUserId).populate('profile');
    if (!gymUser || gymUser.role !== 'gym') {
      return res.status(404).json({ message: 'Gym not found' });
    }

    if (userType === 'trainer') {
      const trainer = await Trainer.findById(userId);
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
      if (trainer.gym) {
        return res.status(400).json({ message: 'Trainer already belongs to a gym' });
      }
      trainer.gym = gymUser.profile._id;
      await trainer.save();
      res.status(200).json({ message: 'Trainer added to gym' });
    } else if (userType === 'member') {
      const member = await Member.findById(userId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      if (member.gym) {
        return res.status(400).json({ message: 'Member already belongs to a gym' });
      }
      member.gym = gymUser.profile._id;
      await member.save();
      res.status(200).json({ message: 'Member added to gym' });
    } else {
      res.status(400).json({ message: 'Invalid user type' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateGymProfile, getJoinRequests, acceptJoinRequest };