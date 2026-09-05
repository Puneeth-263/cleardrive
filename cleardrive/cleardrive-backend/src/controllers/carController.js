const Car = require('../models/Car');

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.getAll();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.getById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

exports.getRecommendations = async (req, res) => {
  const { minBudget, maxBudget, fuelType, bodyType, transmission, isUsed } = req.body;

  const parsedMax = Number(maxBudget);
  const parsedMin = Number(minBudget) || 0;

  if (!maxBudget || Number.isNaN(parsedMax) || parsedMax <= 0) {
    return res.status(400).json({ error: 'maxBudget is required and must be a positive number' });
  }
  if (minBudget !== undefined && Number.isNaN(parsedMin)) {
    return res.status(400).json({ error: 'minBudget must be a number' });
  }
  if (parsedMin > parsedMax) {
    return res.status(400).json({ error: 'minBudget cannot be greater than maxBudget' });
  }

  try {
    const results = await Car.recommend({
      minBudget: parsedMin,
      maxBudget: parsedMax,
      fuelType,
      bodyType,
      transmission,
      isUsed: isUsed === undefined ? undefined : Boolean(isUsed),
    });

    res.json({ count: results.length, cars: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

exports.compareCars = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
    return res.status(400).json({ error: 'Provide an array of 2 or 3 car ids to compare' });
  }

  try {
    const cars = await Car.getByIds(ids);
    res.json({ cars });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars for comparison' });
  }
};
