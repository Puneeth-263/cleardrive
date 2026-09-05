require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const carRoutes = require('./routes/carRoutes');
const priceRoutes = require('./routes/priceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// In production, set FRONTEND_URL to your Netlify site (e.g.
// https://cleardrive.netlify.app) so only your frontend can call this API.
// Locally it falls back to allowing all origins.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ClearDrive API is running' }));

// Mount routes
app.use('/api/cars', carRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ClearDrive backend running on http://localhost:${PORT}`);
  });
});

module.exports = app;
