const mongoose = require('mongoose');
const ReviewSchema = require('./mongo/ReviewSchema');
const CarSchema = require('./mongo/CarSchema');

let memoryReviews = [];
let nextId = 1;

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// Recomputes and stores the average rating + count on the car document
// (Mongo mode only; in-memory mode computes this on the fly when read).
async function refreshCarRating(carId) {
  if (!isDbConnected()) return;
  const stats = await ReviewSchema.aggregate([
    { $match: { carId: Number(carId) } },
    { $group: { _id: '$carId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await CarSchema.updateOne(
    { id: Number(carId) },
    { avgRating: Math.round(avg * 10) / 10, reviewCount: count }
  );
}

class Review {
  static async getForCar(carId) {
    if (isDbConnected()) {
      return ReviewSchema.find({ carId: Number(carId) }).sort({ createdAt: -1 }).lean();
    }
    return memoryReviews
      .filter((r) => r.carId === Number(carId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async create({ carId, userId, name, rating, comment }) {
    if (isDbConnected()) {
      const doc = await ReviewSchema.create({ carId: Number(carId), userId, name, rating, comment });
      await refreshCarRating(carId);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
    const review = {
      id: nextId++,
      carId: Number(carId),
      userId: userId || null,
      name,
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString(),
    };
    memoryReviews.push(review);
    return review;
  }

  static async getSummaryForCar(carId) {
    const reviews = await Review.getForCar(carId);
    if (reviews.length === 0) return { avgRating: 0, reviewCount: 0 };
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { avgRating: Math.round(avg * 10) / 10, reviewCount: reviews.length };
  }
}

module.exports = Review;
