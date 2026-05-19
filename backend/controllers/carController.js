const asyncHandler = require('express-async-handler');
const Car = require('../models/carModel');
const Booking = require('../models/bookingModel');

// @desc    Get all cars (with optional filters: brand, city, status, startDate, endDate)
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const { brand, city, status, startDate, endDate } = req.query;
  let query = {};

  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  // Only filter by status if explicitly requested; default to showing all non-deleted
  if (status) {
    query.status = status;
  }

  let cars = await Car.find(query)
    .populate('location_id', 'name city address')
    .sort({ createdAt: -1 });

  // Filter by city name (from location relation)
  if (city && city !== 'Select City' && city.trim() !== '') {
    cars = cars.filter(
      (car) => car.location_id?.city?.toLowerCase() === city.toLowerCase()
    );
  }

  // Filter by date availability — exclude cars with overlapping confirmed bookings
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all bookings that overlap with the requested range
    const overlappingBookings = await Booking.find({
      status: { $in: ['pending_payment', 'payment_submitted', 'confirmed'] },
      $or: [
        // Booking starts during the requested window
        { start_date: { $gte: start, $lt: end } },
        // Booking ends during the requested window
        { end_date: { $gt: start, $lte: end } },
        // Booking completely wraps the requested window
        { start_date: { $lte: start }, end_date: { $gte: end } },
      ],
    }).select('car_id');

    const bookedCarIds = new Set(
      overlappingBookings.map((b) => b.car_id.toString())
    );

    cars = cars.filter((car) => !bookedCarIds.has(car._id.toString()));
  }

  res.json(cars);
});

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate(
    'location_id',
    'name city address'
  );
  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

// @desc    Create a new car (Admin only)
// @route   POST /api/cars
// @access  Private (Admin)
const createCar = asyncHandler(async (req, res) => {
  const { brand, model, year, base_rent_per_day, location_id } = req.body;

  if (!brand || !model || !year || !base_rent_per_day || !location_id) {
    res.status(400);
    throw new Error(
      'All fields (brand, model, year, base_rent_per_day, location_id) are required'
    );
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a car image');
  }

  const car = await Car.create({
    brand,
    model,
    year: Number(year),
    base_rent_per_day: Number(base_rent_per_day),
    location_id,
    image: req.file.path, // Cloudinary URL from multer-cloudinary
  });

  res.status(201).json(car);
});

// @desc    Update a car (Admin only)
// @route   PUT /api/cars/:id
// @access  Private (Admin)
const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  car.brand = req.body.brand || car.brand;
  car.model = req.body.model || car.model;
  car.year = req.body.year ? Number(req.body.year) : car.year;
  car.base_rent_per_day = req.body.base_rent_per_day
    ? Number(req.body.base_rent_per_day)
    : car.base_rent_per_day;
  car.location_id = req.body.location_id || car.location_id;
  car.status = req.body.status || car.status;

  if (req.file) {
    car.image = req.file.path;
  }

  const updatedCar = await car.save();
  res.json(updatedCar);
});

// @desc    Delete a car (Admin only)
// @route   DELETE /api/cars/:id
// @access  Private (Admin)
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  const activeBooking = await Booking.findOne({
    car_id: req.params.id,
    status: { $in: ['pending_payment', 'payment_submitted', 'confirmed'] },
  });

  if (activeBooking) {
    res.status(400);
    throw new Error(
      'Cannot delete car with active or pending bookings. Cancel all bookings first.'
    );
  }

  await car.deleteOne();
  res.json({ message: 'Car removed successfully' });
});

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };