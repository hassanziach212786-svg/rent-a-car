const express = require('express');
const router = express.Router();
const {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule
} = require('../controllers/pricingController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { pricingSchemas } = require('../validations/requestSchemas');

router.route('/')
  .get(protect, admin, getPricingRules)
  .post(protect, admin, validateBody(pricingSchemas.create), createPricingRule);

router.route('/:id')
  .put(protect, admin, validateObjectId(), validateBody(pricingSchemas.update), updatePricingRule)
  .delete(protect, admin, validateObjectId(), deletePricingRule);

module.exports = router;
