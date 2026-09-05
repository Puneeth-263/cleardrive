const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  carId: { type: Number, required: true, unique: true },
  cashDiscount: { type: Number, default: 0 },
  exchangeBonus: { type: Number, default: 0 },
  corporateDiscount: { type: Number, default: 0 },
  validTill: { type: String },
  note: { type: String },
});

module.exports = mongoose.model('Discount', discountSchema);
