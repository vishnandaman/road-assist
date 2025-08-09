const express = require('express');
const Mechanic = require('../models/Mechanic');
const Request = require('../models/Request');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get mechanic profile
// @route   GET /api/mechanics/profile
// @access  Private/Mechanic
router.get('/profile', auth, authorize('mechanic'), async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('currentRequest');

    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic profile not found' });
    }

    res.json({
      success: true,
      data: mechanic
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create/Update mechanic profile
// @route   POST /api/mechanics/profile
// @access  Private/Mechanic
router.post('/profile', auth, authorize('mechanic'), async (req, res, next) => {
  try {
    const {
      specialties,
      experience,
      hourlyRate,
      availability,
      currentLocation
    } = req.body;

    let mechanic = await Mechanic.findOne({ user: req.user._id });

    if (mechanic) {
      // Update existing profile
      mechanic = await Mechanic.findOneAndUpdate(
        { user: req.user._id },
        {
          specialties,
          experience,
          hourlyRate,
          availability,
          currentLocation: currentLocation ? {
            type: 'Point',
            coordinates: [currentLocation.lng, currentLocation.lat]
          } : mechanic.currentLocation
        },
        { new: true, runValidators: true }
      ).populate('user', 'name email phone');
    } else {
      // Create new profile
      mechanic = new Mechanic({
        user: req.user._id,
        specialties,
        experience,
        hourlyRate,
        availability,
        currentLocation: currentLocation ? {
          type: 'Point',
          coordinates: [currentLocation.lng, currentLocation.lat]
        } : undefined
      });
      await mechanic.save();
      await mechanic.populate('user', 'name email phone');
    }

    res.json({
      success: true,
      data: mechanic
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update mechanic availability
// @route   PUT /api/mechanics/availability
// @access  Private/Mechanic
router.put('/availability', auth, authorize('mechanic'), async (req, res, next) => {
  try {
    const { availability } = req.body;

    const mechanic = await Mechanic.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic profile not found' });
    }

    res.json({
      success: true,
      data: mechanic
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get mechanic's current request
// @route   GET /api/mechanics/current-request
// @access  Private/Mechanic
router.get('/current-request', auth, authorize('mechanic'), async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id });
    
    if (!mechanic || !mechanic.currentRequest) {
      return res.json({
        success: true,
        data: null
      });
    }

    const request = await Request.findById(mechanic.currentRequest)
      .populate('user', 'name phone')
      .populate('mechanic', 'name phone');

    res.json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Complete current request
// @route   PUT /api/mechanics/complete-request
// @access  Private/Mechanic
router.put('/complete-request', auth, authorize('mechanic'), async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id });
    
    if (!mechanic || !mechanic.currentRequest) {
      return res.status(400).json({ message: 'No active request found' });
    }

    // Update request status
    const request = await Request.findByIdAndUpdate(
      mechanic.currentRequest,
      {
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );

    // Update mechanic availability
    await Mechanic.findOneAndUpdate(
      { user: req.user._id },
      {
        availability: true,
        currentRequest: null
      }
    );

    res.json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
