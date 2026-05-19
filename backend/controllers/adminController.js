const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Car = require('../models/carModel');
const Booking = require('../models/bookingModel');
const Driver = require('../models/driverModel');
const Payment = require('../models/paymentModel');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  // Run all count queries in parallel for better performance
  const [
    totalUsers,
    totalCars,
    totalBookings,
    availableCars,
    activeDrivers,
    pendingBookings,
    confirmedBookings,
    revenueData,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Car.countDocuments(),
    Booking.countDocuments(),
    Car.countDocuments({ status: 'available' }),
    Driver.countDocuments({ availability_status: 'available' }),
    Booking.countDocuments({ status: 'pending_payment' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]),
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue,
      availableCars,
      activeDrivers,
      pendingBookings,
      confirmedBookings,
    },
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }

  await user.deleteOne();
  res.json({ message: 'User removed successfully' });
});

module.exports = { getDashboardStats, getAllUsers, deleteUser };