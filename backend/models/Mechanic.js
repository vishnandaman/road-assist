const mongoose = require('mongoose');

const MechanicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    type: String,
    enum: ['towing', 'battery', 'fuel', 'tire', 'lockout', 'other']
  }],
  certification: String,
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  currentRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  pricePerKm: {
    type: Number,
    default: 1.5
  },
  basePrice: {
    type: Number,
    default: 20
  }
});

module.exports = mongoose.model('Mechanic', MechanicSchema);