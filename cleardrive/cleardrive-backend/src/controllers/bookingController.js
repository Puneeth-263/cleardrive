const Booking = require('../models/Booking');
const Car = require('../models/Car');

exports.createBooking = async (req, res) => {
  const { carId, customerName, phone, finalPrice } = req.body;

  if (!carId || !customerName || !phone || !finalPrice) {
    return res.status(400).json({ error: 'carId, customerName, phone, finalPrice are all required' });
  }

  try {
    const car = await Car.getById(carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const userId = req.user ? req.user.id : null;
    const booking = await Booking.create({ carId, customerName, phone, finalPrice, userId });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Returns all bookings for the logged-in user (requires optionalAuth/requireAuth
// middleware on the route to populate req.user).
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByUser(req.user.id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your bookings' });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Demo/admin-only endpoint to simulate the showroom moving the buyer's
// booking forward through the process (in a real app, showroom staff
// would trigger this from their own dashboard).
exports.advanceBooking = async (req, res) => {
  try {
    const booking = await Booking.advanceStage(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to advance booking' });
  }
};
