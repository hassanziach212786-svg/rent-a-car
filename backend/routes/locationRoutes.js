const express = require('express');
const router = express.Router();
const { getLocations, createLocation, updateLocation, deleteLocation } = require('../controllers/locationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { locationSchemas } = require('../validations/requestSchemas');

router.route('/').get(getLocations).post(protect, admin, validateBody(locationSchemas.create), createLocation);
router.route('/:id')
  .put(protect, admin, validateObjectId(), validateBody(locationSchemas.update), updateLocation)
  .delete(protect, admin, validateObjectId(), deleteLocation);

module.exports = router;
