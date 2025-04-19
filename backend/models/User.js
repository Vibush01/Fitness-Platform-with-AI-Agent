const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'gym', 'trainer', 'member'],
    required: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'roleModel',
  },
  roleModel: {
    type: String,
    enum: ['Admin', 'Gym', 'Trainer', 'Member'],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);