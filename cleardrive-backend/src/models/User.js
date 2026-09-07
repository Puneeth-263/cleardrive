const mongoose = require('mongoose');
const UserSchema = require('./mongo/UserSchema');

// In-memory fallback, used only when no database is connected.
let memoryUsers = [];
let nextId = 1;

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

class User {
  static async findByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (isDbConnected()) {
      const doc = await UserSchema.findOne({ email: normalized }).lean();
      return doc ? { ...doc, id: doc._id.toString() } : null;
    }
    return memoryUsers.find((u) => u.email === normalized) || null;
  }

  static async findById(id) {
    if (isDbConnected()) {
      const doc = await UserSchema.findById(id).lean().catch(() => null);
      return doc ? { ...doc, id: doc._id.toString() } : null;
    }
    return memoryUsers.find((u) => u.id === Number(id)) || null;
  }

  static async create({ name, email, passwordHash }) {
    const normalized = email.toLowerCase().trim();
    if (isDbConnected()) {
      const doc = await UserSchema.create({ name, email: normalized, passwordHash });
      return { ...doc.toObject(), id: doc._id.toString() };
    }
    const user = { id: nextId++, name, email: normalized, passwordHash, createdAt: new Date().toISOString() };
    memoryUsers.push(user);
    return user;
  }
}

module.exports = User;
