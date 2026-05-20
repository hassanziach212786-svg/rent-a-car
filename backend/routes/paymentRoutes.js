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
const { validateBody, validateObjectId } = require('../middleware/validateRequest');
const { paymentSchemas } = require('../validations/requestSchemas');

// Customer submits proof
router.post('/submit', protect, uploadPaymentProof.single('payment_screenshot'), validateBody(paymentSchemas.submit), submitPaymentProof);

// Admin sees all payments
router.get('/', protect, admin, getAllPayments);

// Admin actions
router.put('/:id/approve', protect, admin, validateObjectId(), approvePayment);
router.put('/:id/reject', protect, admin, validateObjectId(), rejectPayment);

module.exports = router;
