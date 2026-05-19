const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  license_number: { type: String, required: true, unique: true },
  availability_status: { 
    type: String, 
    enum: ['available', 'busy', 'on_leave'], 
    default: 'available' 
  },
  location_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);