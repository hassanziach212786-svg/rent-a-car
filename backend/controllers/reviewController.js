const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

// @desc    Add a review for a car
// @route   POST /api/reviews
// @access  Private (Customer)
const addReview = asyncHandler(async (req, res) => {
  const { car_id, rating, comment } = req.body;

  if (!car_id || !rating || !comment) {
    res.status(400);
    throw new Error('car_id, rating, and comment are required');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // FIX: Verify the user actually completed a booking for this car before reviewing
  const completedBooking = await Booking.findOne({
    user_id: req.user._id,
    car_id,
    status: 'completed',
  });

  if (!completedBooking) {
    res.status(403);
    throw new Error('You can only review a car after completing a booking for it');
  }

  // Check if the user already reviewed this car
  const alreadyReviewed = await Review.findOne({
    user_id: req.user._id,
    car_id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this car');
  }

  const review = await Review.create({
    user_id: req.user._id,
    car_id,
    rating: Number(rating),
    comment,
  });

  res.status(201).json(review);
});

// @desc    Get all reviews for a specific car + average rating
// @route   GET /api/reviews/:car_id
// @access  Public
const getCarReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ car_id: req.params.car_id })
    .populate('user_id', 'name')
    .sort({ createdAt: -1 });

  const count = reviews.length;
  const averageRating =
    count > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / count : 0;

  res.json({
    reviews,
    averageRating: parseFloat(averageRating.toFixed(1)),
    numReviews: count,
  });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private (Customer — own review only)
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only update your own reviews');
  }

  if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  review.rating = req.body.rating ? Number(req.body.rating) : review.rating;
  review.comment = req.body.comment || review.comment;

  const updatedReview = await review.save();
  res.json(updatedReview);
});

// @desc    Delete a review (Owner or Admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const isOwner = review.user_id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted successfully' });
});

module.exports = { addReview, getCarReviews, updateReview, deleteReview };