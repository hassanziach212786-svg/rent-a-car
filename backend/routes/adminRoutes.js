const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validateRequest');

// Get all stats for the dashboard
router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, validateObjectId(), deleteUser);

module.exports = router;
