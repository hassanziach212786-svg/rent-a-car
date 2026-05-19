const asyncHandler = require('express-async-handler');
const Driver = require('../models/driverModel');
const Booking = require('../models/bookingModel');

// @desc    Get all drivers (with optional location filter)
// @route   GET /api/drivers
// @access  Private (Admin)
const getDrivers = asyncHandler(async (req, res) => {
  const { location_id, availability_status } = req.query;
  let query = {};

  if (location_id) query.location_id = location_id;
  if (availability_status) query.availability_status = availability_status;

  const drivers = await Driver.find(query)
    .populate('location_id', 'name city')
    .sort({ createdAt: -1 });

  res.json(drivers);
});

// @desc    Get single driver by ID
// @route   GET /api/drivers/:id
// @access  Private (Admin)
const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate('location_id', 'name city address');

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  res.json(driver);
});

// @desc    Create a new driver (Admin only)
// @route   POST /api/drivers
// @access  Private (Admin)
const createDriver = asyncHandler(async (req, res) => {
  const { name, phone, license_number, location_id } = req.body;

  if (!name || !phone || !license_number || !location_id) {
    res.status(400);
    throw new Error('All fields (name, phone, license_number, location_id) are required');
  }

  const driverExists = await Driver.findOne({ license_number });
  if (driverExists) {
    res.status(400);
    throw new Error('A driver with this license number already exists');
  }

  const driver = await Driver.create({ name, phone, license_number, location_id });
  res.status(201).json(driver);
});

// @desc    Update driver details or status (Admin only)
// @route   PUT /api/drivers/:id
// @access  Private (Admin)
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  driver.name = req.body.name || driver.name;
  driver.phone = req.body.phone || driver.phone;
  driver.location_id = req.body.location_id || driver.location_id;

  // Validate status before updating
  if (req.body.availability_status) {
    const validStatuses = ['available', 'busy', 'on_leave'];
    if (!validStatuses.includes(req.body.availability_status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    driver.availability_status = req.body.availability_status;
  }

  const updatedDriver = await driver.save();
  res.json(updatedDriver);
});

// @desc    Delete a driver (Admin only)
// @route   DELETE /api/drivers/:id
// @access  Private (Admin)
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  // Guard: don't delete a driver who has active bookings
  const activeBooking = await Booking.findOne({
    driver_id: req.params.id,
    status: { $in: ['pending_payment', 'payment_submitted', 'confirmed'] },
  });

  if (activeBooking) {
    res.status(400);
    throw new Error('Cannot delete driver with active bookings. Reassign the bookings first.');
  }

  await driver.deleteOne();
  res.json({ message: 'Driver removed successfully' });
});

module.exports = { getDrivers, getDriverById, createDriver, updateDriver, deleteDriver };