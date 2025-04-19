const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  experience: {
    years: { type: Number, required: true },
    months: { type: Number, required: true },
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
  },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);