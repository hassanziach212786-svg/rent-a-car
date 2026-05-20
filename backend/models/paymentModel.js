const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'JazzCash', 'Easypaisa'],
      required: true,
    },
    // FIX: Only required for JazzCash and Easypaisa, not Cash
    payment_screenshot: {
      type: String,
      required: function () {
        return this.payment_method !== 'Cash';
      },
      default: null,
    },
    // FIX: Removed 'failed' — rejections now consistently use 'rejected'
    status: {
      type: String,
      enum: ['pending', 'paid', 'rejected'],
      default: 'pending',
    },
    transaction_reference: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
