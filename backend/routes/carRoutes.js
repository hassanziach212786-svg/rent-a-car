const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { carSchemas } = require('../validations/requestSchemas');

router.route('/')
  .get(getCars)
  .post(protect, admin, upload.single('image'), validateBody(carSchemas.create), createCar);

router.route('/:id')
  .get(validateObjectId(), getCarById)
  .put(protect, admin, validateObjectId(), upload.single('image'), validateBody(carSchemas.update, { allowEmptyWithFile: true }), updateCar)
  .delete(protect, admin, validateObjectId(), deleteCar);

module.exports = router;
