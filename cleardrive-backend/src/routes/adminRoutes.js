const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../utils/auth');

router.post('/login', adminController.login);
router.get('/bookings', requireAdmin, adminController.listBookings);
router.post('/bookings/:id/advance', requireAdmin, adminController.advanceBooking);
router.get('/cars', requireAdmin, adminController.getAllCarsForAdmin);
router.patch('/cars/:id', requireAdmin, adminController.updateCar);
router.put('/discounts/:carId', requireAdmin, adminController.updateDiscount);

module.exports = router;
