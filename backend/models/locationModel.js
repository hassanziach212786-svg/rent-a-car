const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  city: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  address: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  phone: { type: String, trim: true },
  hours: { type: String, trim: true, maxlength: 80, default: '24/7 Open' }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
