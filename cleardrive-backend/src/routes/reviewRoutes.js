const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuth } = require('../utils/auth');

router.get('/:carId', reviewController.getReviewsForCar);
router.post('/:carId', optionalAuth, reviewController.addReview);

module.exports = router;
