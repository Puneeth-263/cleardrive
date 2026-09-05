const mongoose = require('mongoose');
const { signAdminToken } = require('../utils/auth');
const CarSchema = require('../models/mongo/CarSchema');
const DiscountSchema = require('../models/mongo/DiscountSchema');
const Booking = require('../models/Booking');
const Car = require('../models/Car');

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

exports.login = (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin login is not configured (set ADMIN_PASSWORD in .env)' });
  }
  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }
  res.json({ token: signAdminToken() });
};

exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

exports.advanceBooking = async (req, res) => {
  try {
    const booking = await Booking.advanceStage(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to advance booking' });
  }
};

// Update a car's ex-showroom price and/or feature list. In-memory-only
// mode (no MongoDB) can't persist this since cars.json is read-only at
// runtime; this route only works fully with MONGODB_URI set.
exports.updateCar = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(400).json({ error: 'Editing car data requires MongoDB to be connected' });
  }
  try {
    const updates = req.body;
    delete updates.id;
    const car = await CarSchema.findOneAndUpdate({ id: Number(req.params.id) }, updates, { new: true });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update car' });
  }
};

exports.updateDiscount = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(400).json({ error: 'Editing discounts requires MongoDB to be connected' });
  }
  try {
    const { cashDiscount, exchangeBonus, corporateDiscount, validTill, note } = req.body;
    const discount = await DiscountSchema.findOneAndUpdate(
      { carId: Number(req.params.carId) },
      { cashDiscount, exchangeBonus, corporateDiscount, validTill, note },
      { new: true, upsert: true }
    );
    res.json(discount);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update discount' });
  }
};

exports.getAllCarsForAdmin = async (req, res) => {
  try {
    const cars = await Car.getAll();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};
