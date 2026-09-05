const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/recommendations', carController.getRecommendations);
router.post('/compare', carController.compareCars);

module.exports = router;
