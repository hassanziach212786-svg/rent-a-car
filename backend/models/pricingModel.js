const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  date_from: { type: Date, required: true },
  date_to: { type: Date, required: true },
  multiplier: { type: Number, required: true, default: 1.0 },
  reason: { type: String } // e.g., "Holiday Season", "Weekend"
}, { timestamps: true });

module.exports = mongoose.model('Pricing', pricingSchema);