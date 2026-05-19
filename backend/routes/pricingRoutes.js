const express = require('express');
const router = express.Router();
const {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule
} = require('../controllers/pricingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getPricingRules)
  .post(protect, admin, createPricingRule);

router.route('/:id')
  .put(protect, admin, updatePricingRule)
  .delete(protect, admin, deletePricingRule);

module.exports = router;