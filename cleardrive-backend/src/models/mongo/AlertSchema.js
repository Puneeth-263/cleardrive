const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  carId: { type: Number, required: true },
  email: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', alertSchema);
