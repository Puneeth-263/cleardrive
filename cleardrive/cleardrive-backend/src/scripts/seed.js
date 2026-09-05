// One-time script to load cars.json and discounts.json into MongoDB.
// Run with: npm run seed
// Safe to re-run: it clears and re-inserts, so it won't create duplicates.

require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const cars = require('../data/cars.json');
const discounts = require('../data/discounts.json');
const CarSchema = require('../models/mongo/CarSchema');
const DiscountSchema = require('../models/mongo/DiscountSchema');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ No MONGODB_URI found. Set it in your .env file first.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB. Seeding data...');

  await CarSchema.deleteMany({});
  await CarSchema.insertMany(cars);
  console.log(`Inserted ${cars.length} cars.`);

  await DiscountSchema.deleteMany({});
  await DiscountSchema.insertMany(discounts);
  console.log(`Inserted ${discounts.length} discounts.`);

  console.log('✅ Seeding complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
