const mongoose = require('mongoose');
const AlertSchema = require('./mongo/AlertSchema');

let memoryAlerts = [];
let nextId = 1;

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

class Alert {
  static async create({ carId, email, targetPrice }) {
    if (isDbConnected()) {
      const doc = await AlertSchema.create({ carId: Number(carId), email, targetPrice });
      return { ...doc.toObject(), id: doc._id.toString() };
    }
    const alert = {
      id: nextId++,
      carId: Number(carId),
      email,
      targetPrice,
      notified: false,
      createdAt: new Date().toISOString(),
    };
    memoryAlerts.push(alert);
    return alert;
  }

  // Returns alerts whose target price is now met, given a map of
  // { carId: currentEffectivePrice }. Does not send anything itself —
  // wiring this to a real email/SMS provider is left to the caller
  // (see server.js comment near the alerts route for where to add that).
  static async checkAndFindMatches(currentPricesByCarId) {
    const all = isDbConnected() ? await AlertSchema.find({ notified: false }).lean() : memoryAlerts.filter((a) => !a.notified);
    const matches = all.filter((a) => {
      const price = currentPricesByCarId[a.carId];
      return price !== undefined && price <= a.targetPrice;
    });

    if (isDbConnected()) {
      const ids = matches.map((m) => m._id);
      if (ids.length) await AlertSchema.updateMany({ _id: { $in: ids } }, { notified: true });
    } else {
      matches.forEach((m) => {
        const alert = memoryAlerts.find((a) => a.id === m.id);
        if (alert) alert.notified = true;
      });
    }

    return matches;
  }
}

module.exports = Alert;
