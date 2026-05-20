const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  logoutUser,
  getMe // 1. Add this import
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // 2. Add your middleware
const { validateBody } = require('../middleware/validateRequest');
const { authSchemas } = require('../validations/requestSchemas');

// Standard Auth Routes
router.post('/register', validateBody(authSchemas.register), registerUser);
router.post('/login', validateBody(authSchemas.login), loginUser);
router.post('/logout', logoutUser);

// 3. ADD THIS ROUTE - This fixes the 404 error
router.get('/me', protect, getMe); 

module.exports = router;
