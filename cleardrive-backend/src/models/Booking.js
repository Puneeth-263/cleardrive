const mongoose = require('mongoose');
const { BookingModel, STAGES } = require('./mongo/BookingSchema');

// Fallback in-memory store, used only when no database is connected
// (e.g. running locally without a MONGODB_URI set).
let memoryBookings = [];
let nextId = 1;

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

class Booking {
  static async create({ carId, customerName, phone, finalPrice, userId }) {
    if (isDbConnected()) {
      const doc = await BookingModel.create({ carId, customerName, phone, finalPrice, userId: userId || undefined });
      return { ...doc.toObject(), id: doc._id.toString() };
    }

    const booking = {
      id: nextId++,
      carId,
      customerName,
      phone,
      finalPrice,
      userId: userId || null,
      currentStageIndex: 0,
      stages: STAGES,
      createdAt: new Date().toISOString(),
    };
    memoryBookings.push(booking);
    return booking;
  }

  static async getByUser(userId) {
    if (isDbConnected()) {
      const docs = await BookingModel.find({ userId }).sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({ ...d, id: d._id.toString() }));
    }
    return memoryBookings
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async getById(id) {
    if (isDbConnected()) {
      const doc = await BookingModel.findById(id).lean().catch(() => null);
      return doc ? { ...doc, id: doc._id.toString() } : null;
    }
    return memoryBookings.find((b) => b.id === Number(id));
  }

  static async advanceStage(id) {
    if (isDbConnected()) {
      const doc = await BookingModel.findById(id).catch(() => null);
      if (!doc) return null;
      if (doc.currentStageIndex < doc.stages.length - 1) {
        doc.currentStageIndex += 1;
        await doc.save();
      }
      return { ...doc.toObject(), id: doc._id.toString() };
    }

    const booking = memoryBookings.find((b) => b.id === Number(id));
    if (!booking) return null;
    if (booking.currentStageIndex < booking.stages.length - 1) {
      booking.currentStageIndex += 1;
    }
    return booking;
  }

  static async getAll() {
    if (isDbConnected()) {
      const docs = await BookingModel.find().lean();
      return docs.map((d) => ({ ...d, id: d._id.toString() }));
    }
    return memoryBookings;
  }
}

module.exports = Booking;
