const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Optional
  pickup_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  return_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  rental_hours: { type: Number, default: 0 },
  billed_days: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  status: { 
  type: String, 
  enum: ['pending_payment', 'payment_submitted', 'confirmed', 'completed', 'cancelled'], 
  default: 'pending_payment' 
}
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
