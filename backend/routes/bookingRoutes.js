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
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { bookingSchemas } = require('../validations/requestSchemas');

router.route('/')
  .get(protect, admin, getAllBookings)
  .post(protect, validateBody(bookingSchemas.create), createBooking);

router.get('/mybookings', protect, getMyBookings);
router.get('/my-bookings', protect, getMyBookings);

router.put('/:id/status', protect, admin, validateObjectId(), validateBody(bookingSchemas.updateStatus), updateBookingStatus);
router.put('/:id/cancel', protect, validateObjectId(), cancelBooking);
router.get('/:id', protect, validateObjectId(), getBookingById);

module.exports = router;
