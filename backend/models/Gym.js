const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: [{
    type: String, // URLs from Cloudinary
  }],
  ownerName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Gym', gymSchema);