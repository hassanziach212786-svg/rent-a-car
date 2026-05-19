const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const Booking = require('../models/bookingModel');

// @desc    Customer submits payment proof
// @route   POST /api/payments/submit
// @access  Private (Customer)
const submitPaymentProof = asyncHandler(async (req, res) => {
  const { booking_id, payment_method, amount } = req.body;

  if (!booking_id || !payment_method || !amount) {
    res.status(400);
    throw new Error('booking_id, payment_method, and amount are required');
  }

  const booking = await Booking.findById(booking_id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure the booking belongs to the logged-in user
  if (booking.user_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to submit payment for this booking');
  }

  // Only allow payment submission for bookings in pending_payment state
  if (booking.status !== 'pending_payment') {
    res.status(400);
    throw new Error(`Cannot submit payment for a booking with status: ${booking.status}`);
  }

  // FIX: Screenshot is only required for non-Cash payments
  const requiresScreenshot = payment_method !== 'Cash';
  if (requiresScreenshot && !req.file) {
    res.status(400);
    throw new Error('Please upload a payment screenshot for Easypaisa or JazzCash payments');
  }

  const transaction_reference = `MAN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const payment = await Payment.create({
    booking_id,
    amount: Number(amount),
    payment_method,
    // FIX: Set to null for Cash, Cloudinary URL for digital payments
    payment_screenshot: req.file ? req.file.path : null,
    transaction_reference,
    status: 'pending',
  });

  // Update booking status to show payment has been submitted
  booking.status = 'payment_submitted';
  await booking.save();

  res.status(201).json({
    message: 'Payment submitted successfully. Waiting for admin approval.',
    payment,
  });
});

// @desc    Admin approves a payment and confirms the booking
// @route   PUT /api/payments/:id/approve
// @access  Private (Admin)
const approvePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }

  if (payment.status !== 'pending') {
    res.status(400);
    throw new Error(`Payment has already been ${payment.status}`);
  }

  const booking = await Booking.findById(payment.booking_id);

  payment.status = 'paid';
  await payment.save();

  if (booking) {
    booking.status = 'confirmed';
    await booking.save();
  }

  res.json({ message: 'Payment approved and booking confirmed', payment });
});

// @desc    Admin rejects a payment and reverts booking to pending
// @route   PUT /api/payments/:id/reject
// @access  Private (Admin)
const rejectPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }

  if (payment.status !== 'pending') {
    res.status(400);
    throw new Error(`Payment has already been ${payment.status}`);
  }

  const booking = await Booking.findById(payment.booking_id);

  payment.status = 'rejected';
  await payment.save();

  if (booking) {
    // Revert booking so the customer can re-submit payment
    booking.status = 'pending_payment';
    await booking.save();
  }

  res.json({ message: 'Payment rejected. Customer needs to re-submit proof.', payment });
});

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private (Admin)
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .populate({
      path: 'booking_id',
      populate: [
        { path: 'user_id', select: 'name email phone' },
        { path: 'car_id', select: 'brand model' },
      ],
    })
    .sort({ createdAt: -1 });

  res.json(payments);
});

// @desc    Get payment for a specific booking (Owner or Admin)
// @route   GET /api/payments/booking/:bookingId
// @access  Private
const getPaymentByBooking = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ booking_id: req.params.bookingId });

  if (!payment) {
    res.status(404);
    throw new Error('No payment found for this booking');
  }

  res.json(payment);
});

module.exports = {
  submitPaymentProof,
  approvePayment,
  rejectPayment,
  getAllPayments,
  getPaymentByBooking,
};