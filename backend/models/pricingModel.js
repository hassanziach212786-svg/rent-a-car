const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  date_from: { type: Date, required: true },
  date_to: { type: Date, required: true },
  multiplier: { type: Number, required: true, min: 0.01, max: 10, default: 1.0 },
  reason: { type: String, trim: true, maxlength: 120 } // e.g., "Holiday Season", "Weekend"
}, { timestamps: true });

module.exports = mongoose.model('Pricing', pricingSchema);
