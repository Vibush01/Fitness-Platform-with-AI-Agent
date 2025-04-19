const Gym = require('../models/Gym');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');

const getGyms = async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGymDetails = async (req, res) => {
  const { gymId } = req.params;

  try {
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.status(200).json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinGymRequest = async (req, res) => {
  const { gymId, membershipTimeline } = req.body; // membershipTimeline for members only
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    if (user.role === 'trainer') {
      const trainer = await Trainer.findById(user.profile._id);
      if (trainer.gym) {
        return res.status(400).json({ message: 'Trainer already belongs to a gym' });
      }
      // Join request is handled by the gym accepting it (no additional action needed here)
      res.status(200).json({ message: 'Join request sent to gym' });
    } else if (user.role === 'member') {
      const member = await Member.findById(user.profile._id);
      if (member.gym) {
        return res.status(400).json({ message: 'Member already belongs to a gym' });
      }
      // Join request is handled by the gym accepting it (membershipTimeline can be stored in future)
      res.status(200).json({ message: 'Join request sent to gym', membershipTimeline });
    } else {
      res.status(400).json({ message: 'Invalid role' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGyms, getGymDetails, joinGymRequest };