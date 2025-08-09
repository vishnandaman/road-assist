const express = require('express');
const {
  createRequest,
  getNearbyRequests,
  acceptRequest
} = require('../controllers/requestController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createRequest);
router.get('/nearby', auth, authorize('mechanic'), getNearbyRequests);
router.put('/:id/accept', auth, authorize('mechanic'), acceptRequest);

module.exports = router;