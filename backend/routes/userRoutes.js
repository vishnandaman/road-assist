const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', auth, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
router.put('/location', auth, async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get nearby mechanics
// @route   GET /api/users/mechanics/nearby
// @access  Private
router.get('/mechanics/nearby', auth, async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;

    const mechanics = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseInt(maxDistance),
          spherical: true,
          query: { role: 'mechanic' }
        }
      },
      {
        $lookup: {
          from: 'mechanics',
          localField: '_id',
          foreignField: 'user',
          as: 'mechanicProfile'
        }
      },
      { $unwind: '$mechanicProfile' },
      { $match: { 'mechanicProfile.availability': true } },
      {
        $project: {
          password: 0,
          createdAt: 0,
          updatedAt: 0
        }
      }
    ]);

    res.json({
      success: true,
      count: mechanics.length,
      data: mechanics
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
