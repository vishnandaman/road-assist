const Request = require('../models/Request');
const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const { calculateDistance } = require('../utils/geolocation');
const { sendNotification } = require('../utils/notifications');

// @desc    Create a new service request
// @route   POST /api/requests
// @access  Public
exports.createRequest = async (req, res, next) => {
  try {
    const { userId, serviceType, vehicleType, description, location } = req.body;

    // Create request
    const request = await Request.create({
      user: userId,
      serviceType,
      vehicleType,
      description,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    });

    // Find nearby mechanics (within 5km)
    const mechanics = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          distanceField: 'distance',
          maxDistance: 5000, // 5km in meters
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
      { $match: { 'mechanicProfile.availability': true } }
    ]);

    // Notify mechanics
    mechanics.forEach(mechanic => {
      sendNotification(mechanic._id, {
        title: 'New Service Request',
        body: `New ${serviceType} request nearby`,
        data: { requestId: request._id }
      });
    });

    res.status(201).json({
      success: true,
      data: request,
      availableMechanics: mechanics.length
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get nearby requests for mechanics
// @route   GET /api/requests/nearby
// @access  Private (Mechanic)
exports.getNearbyRequests = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query; // Default 5km

    const requests = await Request.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseInt(maxDistance),
          spherical: true,
          query: { status: 'pending' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.role': 0,
          'user.createdAt': 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept a service request
// @route   PUT /api/requests/:id/accept
// @access  Private (Mechanic)
exports.acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mechanicId, price, estimatedTime } = req.body;

    // Calculate distance for pricing
    const request = await Request.findById(id);
    const mechanic = await User.findById(mechanicId);
    
    const distance = calculateDistance(
      request.location.coordinates[1],
      request.location.coordinates[0],
      mechanic.location.coordinates[1],
      mechanic.location.coordinates[0]
    );

    const finalPrice = price || (distance * 1.5 + 20); // Example pricing model

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      {
        mechanic: mechanicId,
        status: 'accepted',
        price: finalPrice,
        estimatedTime: estimatedTime || Math.round(distance * 2), // 2 min per km
        acceptedAt: new Date()
      },
      { new: true }
    );

    // Update mechanic's availability
    await Mechanic.findOneAndUpdate(
      { user: mechanicId },
      { availability: false, currentRequest: id }
    );

    // Notify user
    sendNotification(request.user, {
      title: 'Request Accepted',
      body: `Mechanic is on the way. ETA: ${updatedRequest.estimatedTime} minutes`,
      data: { requestId: id }
    });

    res.status(200).json({
      success: true,
      data: updatedRequest
    });
  } catch (err) {
    next(err);
  }
};