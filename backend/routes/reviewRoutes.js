const express = require('express');
const router = express.Router();
const {
  addReview,
  getCarReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

// Public route to see car reviews
router.get('/car/:car_id', getCarReviews);

module.exports = router;