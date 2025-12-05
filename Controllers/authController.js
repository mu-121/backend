require("dotenv").config();
const User = require("../models/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const sendOTPEmail = require("../utils/sendotp");
// SIGN UP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    await sendOTPEmail(email, otp); // Send OTP email

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      user: { name: user.name, email: user.email },

    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// SIGN IN
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Email not verified. Please verify first." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Mark user as online on successful login
    user.status = "online";
    user.lastSeen = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d"}
    );


    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, status: user.status },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// LOG OUT
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "offline";
    user.lastSeen = new Date();
    await user.save();

    res.status(200).json({
      message: "Logout successful",
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;

    await sendOTPEmail(email, otp);
    await user.save();

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fields that can be updated directly from the body
    const allowedFields = [
      "name",
      "bio",
      "phone",
      "location",
      "profileImageUrl",
      "profileImageId",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      // Remove old asset if present to avoid orphaned files
      if (user.profileImageId) {
        try {
          await cloudinary.uploader.destroy(user.profileImageId);
        } catch (err) {
          console.warn("Failed to cleanup old profile image:", err.message);
        }
      }

      updates.profileImageUrl = req.file.path;
      updates.profileImageId = req.file.filename;
    }

    Object.assign(user, updates);
    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    delete sanitizedUser.otp;
    delete sanitizedUser.otpExpiresAt;

    res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  try {
    // Fetch all users (exclude sensitive fields)
    const users = await User.find({}).select("-password -otp -otpExpiresAt");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signup, signin, verifyOtp, resendOtp, forgotPassword,resetPassword,getUsers,updateProfile,logout };
