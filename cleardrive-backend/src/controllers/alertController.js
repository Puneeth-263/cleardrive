const Alert = require('../models/Alert');
const Car = require('../models/Car');
const { buildPriceBreakdown } = require('../utils/priceCalculator');

exports.createAlert = async (req, res) => {
  const { carId, email, targetPrice } = req.body;
  if (!carId || !email || !targetPrice) {
    return res.status(400).json({ error: 'carId, email, and targetPrice are all required' });
  }

  try {
    const car = await Car.getById(carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const alert = await Alert.create({ carId, email, targetPrice });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

// Manual trigger: recomputes each car's best current on-road price (with
// its active discount applied, using a representative state/config so
// alerts have something consistent to compare against) and returns any
// alerts that now qualify.
//
// NOTE: this only *finds* matches — it doesn't send anything. To make
// this real, call an email provider (e.g. Resend/SendGrid) or SMS
// provider (e.g. Twilio) here with your own API key, and call this
// endpoint on a schedule (a cron job, or a scheduled Render/Netlify
// function) instead of manually.
exports.checkAlerts = async (req, res) => {
  try {
    const cars = await Car.getAll();
    const referenceState = 'Karnataka';

    const currentPricesByCarId = {};
    for (const car of cars) {
      const discount = await Car.getDiscountForCar(car.id);
      const breakdown = buildPriceBreakdown({
        exShowroomPrice: car.exShowroomPrice,
        state: referenceState,
        discount,
      });
      currentPricesByCarId[car.id] = breakdown.totals.finalOnRoadPrice;
    }

    const matches = await Alert.checkAndFindMatches(currentPricesByCarId);
    res.json({ checkedCars: cars.length, matchesFound: matches.length, matches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check alerts' });
  }
};
