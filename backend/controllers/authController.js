const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Gym = require('../models/Gym');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');

const signup = async (req, res) => {
  const { email, password, role, name, address, photos, ownerName, experience, contact } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create profile based on role
    let profile;
    let roleModel;
    switch (role) {
      case 'admin':
        profile = await Admin.create({ name });
        roleModel = 'Admin';
        break;
      case 'gym':
        profile = await Gym.create({ name, address, photos: photos || [], ownerName });
        roleModel = 'Gym';
        break;
      case 'trainer':
        profile = await Trainer.create({ name, experience: { years: experience.years, months: experience.months } });
        roleModel = 'Trainer';
        break;
      case 'member':
        profile = await Member.create({ name, contact });
        roleModel = 'Member';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Create user
    user = await User.create({
      email,
      password: hashedPassword,
      role,
      profile: profile._id,
      roleModel,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email }).populate('profile');
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`User found: ${user.email}, Role: ${user.role}`);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`Login successful for email: ${email}`);

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, email, role: user.role, profile: user.profile } });
  } catch (error) {
    console.error(`Login error for email: ${email}`, error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };