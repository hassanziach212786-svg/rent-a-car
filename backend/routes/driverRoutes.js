const express = require('express');
const router = express.Router();
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { driverSchemas } = require('../validations/requestSchemas');

router.route('/').get(getDrivers).post(protect, admin, validateBody(driverSchemas.create), createDriver);
router.route('/:id')
  .put(protect, admin, validateObjectId(), validateBody(driverSchemas.update), updateDriver)
  .delete(protect, admin, validateObjectId(), deleteDriver);

module.exports = router;
