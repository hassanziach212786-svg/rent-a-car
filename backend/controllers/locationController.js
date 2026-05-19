const asyncHandler = require('express-async-handler');
const Location = require('../models/locationModel');
const Car = require('../models/carModel');

const buildLocationPayload = (body) => {
  const payload = {
    name: body.name,
    city: body.city,
    address: body.address,
    phone: body.phone,
    hours: body.hours,
  };

  if (body.latitude !== undefined) {
    payload.latitude = body.latitude === '' ? null : Number(body.latitude);
  }

  if (body.longitude !== undefined) {
    payload.longitude = body.longitude === '' ? null : Number(body.longitude);
  }

  return payload;
};

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({}).sort({ city: 1 });
  res.json(locations);
});

// @desc    Get single location by ID
// @route   GET /api/locations/:id
// @access  Public
const getLocationById = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    res.status(404);
    throw new Error('Location not found');
  }

  res.json(location);
});

// @desc    Create a new location (Admin only)
// @route   POST /api/locations
// @access  Private (Admin)
const createLocation = asyncHandler(async (req, res) => {
  const { name, city, address } = req.body;

  if (!name || !city || !address) {
    res.status(400);
    throw new Error('All fields (name, city, address) are required');
  }

  const location = await Location.create(buildLocationPayload(req.body));
  res.status(201).json(location);
});

// @desc    Update a location (Admin only)
// @route   PUT /api/locations/:id
// @access  Private (Admin)
const updateLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    res.status(404);
    throw new Error('Location not found');
  }

  const updates = buildLocationPayload(req.body);

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      location[key] = value;
    }
  });

  const updatedLocation = await location.save();
  res.json(updatedLocation);
});

// @desc    Delete a location (Admin only)
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    res.status(404);
    throw new Error('Location not found');
  }

  // Guard: don't delete a location that has cars assigned to it
  const carsAtLocation = await Car.countDocuments({ location_id: req.params.id });
  if (carsAtLocation > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete location. ${carsAtLocation} car(s) are currently assigned to it.`
    );
  }

  await location.deleteOne();
  res.json({ message: 'Location removed successfully' });
});

module.exports = { getLocations, getLocationById, createLocation, updateLocation, deleteLocation };
