const mongoose = require('mongoose');

const bodyProgressSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  muscleMass: {
    type: Number,
    required: true,
  },
  fatPercentage: {
    type: Number,
    required: true,
  },
  images: [{
    type: String, // URLs from Cloudinary
  }],
  loggedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('BodyProgress', bodyProgressSchema);