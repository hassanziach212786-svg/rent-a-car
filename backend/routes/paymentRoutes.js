const express = require('express');
const router = express.Router();
const { 
    submitPaymentProof, 
    approvePayment, 
    rejectPayment, 
    getAllPayments 
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadPaymentProof } = require('../config/paymentCloudinary');

// Customer submits proof
router.post('/submit', protect, uploadPaymentProof.single('payment_screenshot'), submitPaymentProof);

// Admin sees all payments
router.get('/', protect, admin, getAllPayments);

// Admin actions
router.put('/:id/approve', protect, admin, approvePayment);
router.put('/:id/reject', protect, admin, rejectPayment);

module.exports = router;
