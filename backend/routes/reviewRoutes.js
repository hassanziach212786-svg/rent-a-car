const express = require('express');
const router = express.Router();
const {
  addReview,
  getCarReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { reviewSchemas } = require('../validations/requestSchemas');

router.route('/')
  .post(protect, validateBody(reviewSchemas.create), addReview);

router.route('/:id')
  .put(protect, validateObjectId(), validateBody(reviewSchemas.update), updateReview)
  .delete(protect, validateObjectId(), deleteReview);

// Public route to see car reviews
router.get('/car/:car_id', validateObjectId('car_id'), getCarReviews);

module.exports = router;
