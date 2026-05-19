const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration is already in process.env from previous phases
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rent-a-car-payments', // Separate folder for security
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadPaymentProof = multer({ storage });

module.exports = { uploadPaymentProof };