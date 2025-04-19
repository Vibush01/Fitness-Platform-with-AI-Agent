const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Member = require('../models/Member');

const createAnnouncement = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'gym') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const announcement = await Announcement.create({
      gym: user.profile._id,
      message,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || !['member', 'trainer'].includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let gymId;
    if (user.role === 'member') {
      const member = await Member.findById(user.profile._id);
      gymId = member.gym;
    } else {
      const trainer = await Trainer.findById(user.profile._id);
      gymId = trainer.gym;
    }

    if (!gymId) {
      return res.status(400).json({ message: 'Not associated with a gym' });
    }

    const announcements = await Announcement.find({ gym: gymId }).sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnnouncement, getAnnouncements };