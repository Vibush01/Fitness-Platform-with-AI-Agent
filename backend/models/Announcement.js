const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);