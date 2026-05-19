const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  logoutUser,
  getMe // 1. Add this import
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // 2. Add your middleware

// Standard Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// 3. ADD THIS ROUTE - This fixes the 404 error
router.get('/me', protect, getMe); 

module.exports = router;