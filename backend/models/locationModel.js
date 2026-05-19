const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  phone: { type: String },
  hours: { type: String, default: '24/7 Open' }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
