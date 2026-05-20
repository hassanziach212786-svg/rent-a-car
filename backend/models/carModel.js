const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  model: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  year: { type: Number, required: true, min: 1980, max: new Date().getFullYear() + 1 },
  base_rent_per_day: { type: Number, required: true, min: 1 },
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
