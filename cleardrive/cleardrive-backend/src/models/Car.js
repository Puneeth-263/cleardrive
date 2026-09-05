const mongoose = require('mongoose');
const cars = require('../data/cars.json');
const discounts = require('../data/discounts.json');
const CarSchema = require('./mongo/CarSchema');
const DiscountSchema = require('./mongo/DiscountSchema');

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

class Car {
  static async getAll() {
    if (isDbConnected()) {
      return CarSchema.find().lean();
    }
    return cars;
  }

  static async getById(id) {
    if (isDbConnected()) {
      return CarSchema.findOne({ id: Number(id) }).lean();
    }
    return cars.find((c) => c.id === Number(id));
  }

  static async getDiscountForCar(id) {
    if (isDbConnected()) {
      return DiscountSchema.findOne({ carId: Number(id) }).lean();
    }
    return discounts.find((d) => d.carId === Number(id)) || null;
  }

  /**
   * Simple rule-based recommendation engine.
   * Filters by budget (against ex-showroom price) and optional preferences,
   * then sorts by closeness to the buyer's budget.
   */
  static async recommend({ minBudget = 0, maxBudget = Infinity, fuelType, bodyType, transmission, isUsed }) {
    let results;

    if (isDbConnected()) {
      const query = { exShowroomPrice: { $gte: minBudget, $lte: maxBudget } };
      if (fuelType) query.fuelType = fuelType;
      if (bodyType) query.bodyType = bodyType;
      if (transmission) query.transmission = transmission;
      if (isUsed !== undefined) query.isUsed = isUsed;
      results = await CarSchema.find(query).lean();
    } else {
      results = cars
        .filter((c) => c.exShowroomPrice >= minBudget && c.exShowroomPrice <= maxBudget)
        .filter((c) => !fuelType || c.fuelType === fuelType)
        .filter((c) => !bodyType || c.bodyType === bodyType)
        .filter((c) => !transmission || c.transmission === transmission)
        .filter((c) => isUsed === undefined || Boolean(c.isUsed) === isUsed);
    }

    return results
      .sort((a, b) => Math.abs(a.exShowroomPrice - maxBudget) - Math.abs(b.exShowroomPrice - maxBudget))
      .slice(0, 8);
  }

  static async getByIds(ids) {
    const numericIds = ids.map(Number);
    if (isDbConnected()) {
      return CarSchema.find({ id: { $in: numericIds } }).lean();
    }
    return cars.filter((c) => numericIds.includes(c.id));
  }
}

module.exports = Car;
