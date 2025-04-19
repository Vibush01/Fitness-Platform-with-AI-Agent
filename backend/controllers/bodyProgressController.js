const BodyProgress = require('../models/BodyProgress');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const logBodyProgress = async (req, res) => {
  const { weight, muscleMass, fatPercentage, images } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bodyProgress = await BodyProgress.create({
      member: user.profile._id,
      weight,
      muscleMass,
      fatPercentage,
      images: images || [],
    });

    res.status(201).json(bodyProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBodyProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bodyProgress = await BodyProgress.find({ member: user.profile._id }).sort({ loggedAt: -1 });
    res.status(200).json(bodyProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logBodyProgress, getBodyProgress };