const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { optionalAuth, requireAuth } = require('../utils/auth');

const advanceLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

router.post('/', optionalAuth, bookingController.createBooking);
router.get('/mine', requireAuth, bookingController.getMyBookings);
router.get('/:id', bookingController.getBooking);
// Demo-only: kept public so the "Simulate next stage" button on the
// tracker page keeps working without login. In a real production app,
// this should be admin-only (see /api/admin/bookings/:id/advance for
// that version) and this public route should be removed.
router.post('/:id/advance', advanceLimiter, bookingController.advanceBooking);

module.exports = router;
