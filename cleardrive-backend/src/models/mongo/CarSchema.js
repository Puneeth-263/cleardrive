const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  variant: { type: String, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  exShowroomPrice: { type: Number, required: true },
  bodyType: { type: String, required: true },
  seating: { type: Number, default: 5 },
  features: [String],
  safetyRating: { type: Number, default: 3 },
  mileage: { type: Number },
  image: { type: String },
  isUsed: { type: Boolean, default: false },
  year: { type: Number },
  kmDriven: { type: Number },
  owners: { type: Number },
  condition: { type: String },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Car', carSchema);
