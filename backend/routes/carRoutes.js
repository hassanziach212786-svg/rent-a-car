const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getCars)
  .post(protect, admin, upload.single('image'), createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, admin, upload.single('image'), updateCar)
  .delete(protect, admin, deleteCar);

module.exports = router;