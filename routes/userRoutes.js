const express = require('express');
const router = express.Router();
const upload = require("../middleware/cloudinaryUpload");
const authMiddleware = require("../middleware/authMiddleware");
const { signup, signin,verifyOtp,resendOtp,forgotPassword,resetPassword,getUsers,updateProfile } = require('../Controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/all-users', getUsers);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);
module.exports = router;