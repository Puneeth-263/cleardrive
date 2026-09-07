const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '⚠️  No MONGODB_URI set. Falling back to local JSON files (data will not persist across restarts).'
    );
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('Falling back to local JSON files.');
    return false;
  }
}

module.exports = connectDB;
