const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.post('/calculate', priceController.calculatePrice);
router.get('/discount/:carId', priceController.getDiscount);

module.exports = router;
