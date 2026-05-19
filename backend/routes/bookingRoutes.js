const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getBookingById,
  getAllBookings, 
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAllBookings)
  .post(protect, createBooking);

router.get('/mybookings', protect, getMyBookings);
router.get('/my-bookings', protect, getMyBookings);

router.put('/:id/status', protect, admin, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/:id', protect, getBookingById);

module.exports = router;
