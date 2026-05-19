const asyncHandler = require('express-async-handler');
const Pricing = require('../models/pricingModel');

// @desc    Get all dynamic pricing rules
// @route   GET /api/pricing
// @access  Private (Admin)
const getPricingRules = asyncHandler(async (req, res) => {
  const { car_id } = req.query;
  const query = car_id ? { car_id } : {};

  const rules = await Pricing.find(query)
    .populate('car_id', 'brand model')
    .sort({ date_from: 1 });

  res.json(rules);
});

// @desc    Create a new pricing rule (Admin only)
// @route   POST /api/pricing
// @access  Private (Admin)
const createPricingRule = asyncHandler(async (req, res) => {
  const { car_id, date_from, date_to, multiplier, reason } = req.body;

  if (!car_id || !date_from || !date_to || !multiplier) {
    res.status(400);
    throw new Error('car_id, date_from, date_to, and multiplier are required');
  }

  const from = new Date(date_from);
  const to = new Date(date_to);

  if (from >= to) {
    res.status(400);
    throw new Error('date_to must be after date_from');
  }

  if (Number(multiplier) <= 0) {
    res.status(400);
    throw new Error('Multiplier must be a positive number');
  }

  // Check for overlapping rules for the same car
  const existingRule = await Pricing.findOne({
    car_id,
    date_from: { $lte: to },
    date_to: { $gte: from },
  });

  if (existingRule) {
    res.status(400);
    throw new Error('A pricing rule already exists for this car during the selected date range');
  }

  const rule = await Pricing.create({
    car_id,
    date_from: from,
    date_to: to,
    multiplier: Number(multiplier),
    reason,
  });

  res.status(201).json(rule);
});

// @desc    Update a pricing rule (Admin only)
// @route   PUT /api/pricing/:id
// @access  Private (Admin)
const updatePricingRule = asyncHandler(async (req, res) => {
  const rule = await Pricing.findById(req.params.id);

  if (!rule) {
    res.status(404);
    throw new Error('Pricing rule not found');
  }

  if (req.body.multiplier && Number(req.body.multiplier) <= 0) {
    res.status(400);
    throw new Error('Multiplier must be a positive number');
  }

  rule.multiplier = req.body.multiplier ? Number(req.body.multiplier) : rule.multiplier;
  rule.reason = req.body.reason || rule.reason;
  rule.date_from = req.body.date_from ? new Date(req.body.date_from) : rule.date_from;
  rule.date_to = req.body.date_to ? new Date(req.body.date_to) : rule.date_to;

  if (rule.date_from >= rule.date_to) {
    res.status(400);
    throw new Error('date_to must be after date_from');
  }

  const updatedRule = await rule.save();
  res.json(updatedRule);
});

// @desc    Delete a pricing rule (Admin only)
// @route   DELETE /api/pricing/:id
// @access  Private (Admin)
const deletePricingRule = asyncHandler(async (req, res) => {
  const rule = await Pricing.findById(req.params.id);

  if (!rule) {
    res.status(404);
    throw new Error('Pricing rule not found');
  }

  await rule.deleteOne();
  res.json({ message: 'Pricing rule removed successfully' });
});

module.exports = { getPricingRules, createPricingRule, updatePricingRule, deletePricingRule };