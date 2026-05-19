const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  base_rent_per_day: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  status: { 
    type: String, 
    enum: ['available', 'booked', 'maintenance'], 
    default: 'available' 
  },
  location_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);