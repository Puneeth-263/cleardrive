const mongoose = require('mongoose');
// userId is added below via schema.add so we don't need to touch STAGES export shape.

const STAGES = [
  'Booking Confirmed',
  'Loan Application (if applicable)',
  'Chassis Allotted',
  'Insurance Finalized',
  'PDI Scheduled',
  'PDI Completed',
  'Ready for Delivery',
  'Delivered',
];

const bookingSchema = new mongoose.Schema({
  carId: { type: Number, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  finalPrice: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentStageIndex: { type: Number, default: 0 },
  stages: { type: [String], default: STAGES },
  createdAt: { type: Date, default: Date.now },
});

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = { BookingModel, STAGES };
