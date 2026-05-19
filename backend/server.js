const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const expressMongoSanitize = require('express-mongo-sanitize');

// Load environment variables before importing routes/config that use them.
dotenv.config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const locationRoutes = require('./routes/locationRoutes');
const driverRoutes = require('./routes/driverRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

// 1. SECURITY & PARSING MIDDLEWARE (Must come first)
app.use(cors({ origin: allowedOrigins, credentials: true })); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressMongoSanitize()); // MOVED UP: Protects all routes below

// 2. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Basic Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 3. ERROR HANDLING (Must come last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
