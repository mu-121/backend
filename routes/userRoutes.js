const express = require('express');
const router = express.Router();
const { signup, signin,verifyOtp,resendOtp,forgotPassword,resetPassword,getUsers } = require('../Controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/all-users', getUsers);
module.exports = router;