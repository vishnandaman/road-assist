const mongoose = require('mongoose');

const MechanicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialties: [{
    type: String,
    enum: ['towing', 'battery', 'fuel', 'tire', 'lockout', 'other']
  }],
  experience: {
    type: Number, // years of experience
    default: 0
  },
  hourlyRate: {
    type: Number,
    default: 50
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add 2dsphere index for currentLocation
MechanicSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Mechanic', MechanicSchema);