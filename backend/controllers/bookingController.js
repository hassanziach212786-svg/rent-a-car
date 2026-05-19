const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Car = require('../models/carModel');
const Pricing = require('../models/pricingModel');

const MS_PER_HOUR = 1000 * 60 * 60;
const HOURS_PER_DAY = 24;

const calculateRentalDuration = (start, end) => {
  const diffMs = end - start;
  const rental_hours = Math.ceil(diffMs / MS_PER_HOUR);
  const billed_days = rental_hours / HOURS_PER_DAY;

  return { rental_hours, billed_days };
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = asyncHandler(async (req, res) => {
  const {
    car_id,
    driver_id,
    pickup_location_id,
    return_location_id,
    start_date,
    end_date,
  } = req.body;

  // 1. Validate required fields
  if (!car_id || !pickup_location_id || !return_location_id || !start_date || !end_date) {
    res.status(400);
    throw new Error('car_id, pickup_location_id, return_location_id, start_date, and end_date are required');
  }

  // 2. Validate dates
  const start = new Date(start_date);
  const end = new Date(end_date);

  if (isNaN(start) || isNaN(end)) {
    res.status(400);
    throw new Error('Invalid date format');
  }

  if (start >= end) {
    res.status(400);
    throw new Error('End date must be after start date');
  }

  if (start < new Date()) {
    res.status(400);
    throw new Error('Start date cannot be in the past');
  }

  // 3. Check car exists and is available
  const car = await Car.findById(car_id);
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  if (car.status !== 'available') {
    res.status(400);
    throw new Error(`Car is currently ${car.status} and cannot be booked`);
  }

  // 4. Prevent overlapping bookings for the same car
  // FIX: Use correct enum values — 'pending' was wrong, now uses 'pending_payment', 'payment_submitted', 'confirmed'
  const overlappingBooking = await Booking.findOne({
    car_id,
    status: { $in: ['pending_payment', 'payment_submitted', 'confirmed'] },
    $or: [{ start_date: { $lt: end }, end_date: { $gt: start } }],
  });

  if (overlappingBooking) {
    res.status(400);
    throw new Error('Car is already booked for the selected dates');
  }

  // 5. Calculate rental duration by hour so pickup/return time affects pricing
  const { rental_hours, billed_days } = calculateRentalDuration(start, end);

  // 6. Calculate total amount with Dynamic Pricing
  // FIX: Check if booking range overlaps with any pricing rule (not just start date)
  let multiplier = 1.0;
  const pricingRule = await Pricing.findOne({
    car_id,
    date_from: { $lte: end },
    date_to: { $gte: start },
  });

  if (pricingRule) {
    multiplier = pricingRule.multiplier;
  }

  const total_amount = parseFloat((car.base_rent_per_day * billed_days * multiplier).toFixed(2));

  // 7. Create the booking
  // FIX: Use correct default status 'pending_payment' (matches schema enum)
  const booking = await Booking.create({
    user_id: req.user._id,
    car_id,
    driver_id: driver_id || null,
    pickup_location_id,
    return_location_id,
    start_date: start,
    end_date: end,
    rental_hours,
    billed_days,
    total_amount,
    status: 'pending_payment',
  });

  res.status(201).json(booking);
});

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private (Customer)
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user_id: req.user._id })
    .populate('car_id', 'brand model image base_rent_per_day status')
    .populate('driver_id', 'name phone')
    .populate('pickup_location_id', 'name city address')
    .populate('return_location_id', 'name city address')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Owner or Admin)
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('car_id', 'brand model image base_rent_per_day')
    .populate('driver_id', 'name phone')
    .populate('user_id', 'name email phone')
    .populate('pickup_location_id', 'name city address')
    .populate('return_location_id', 'name city address');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only allow the owner or admin to view
  if (booking.user_id._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user_id', 'name email phone')
    .populate('car_id', 'brand model image')
    .populate('pickup_location_id', 'name city')
    .populate('return_location_id', 'name city')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['pending_payment', 'payment_submitted', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = status;
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

// @desc    Cancel a booking (Customer cancels own booking)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status} and cannot be cancelled`);
  }

  booking.status = 'cancelled';
  const updatedBooking = await booking.save();
  res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
};
