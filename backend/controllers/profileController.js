const User = require('../models/User');
const Admin = require('../models/Admin');
const Gym = require('../models/Gym');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');
const bcrypt = require('bcryptjs');

const updateProfile = async (req, res) => {
  const { name, email, password, photos, experience, contact } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update email and password in the User model
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Update profile-specific details
    let updatedProfile;
    switch (user.role) {
      case 'admin':
        updatedProfile = await Admin.findByIdAndUpdate(
          user.profile._id,
          { name },
          { new: true }
        );
        break;
      case 'gym':
        updatedProfile = await Gym.findByIdAndUpdate(
          user.profile._id,
          { name, photos: photos || user.profile.photos },
          { new: true }
        );
        break;
      case 'trainer':
        updatedProfile = await Trainer.findByIdAndUpdate(
          user.profile._id,
          { name, experience: experience || user.profile.experience },
          { new: true }
        );
        break;
      case 'member':
        updatedProfile = await Member.findByIdAndUpdate(
          user.profile._id,
          { name, contact: contact || user.profile.contact },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    res.status(200).json({ user: { email: user.email, role: user.role }, profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: { email: user.email, role: user.role }, profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getProfile };