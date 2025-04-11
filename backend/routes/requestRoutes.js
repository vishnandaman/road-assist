const express = require('express');
const {
  createRequest,
  getNearbyRequests,
  acceptRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createRequest);
router.get('/nearby', protect, getNearbyRequests);
router.put('/:id/accept', protect, acceptRequest);

module.exports = router;