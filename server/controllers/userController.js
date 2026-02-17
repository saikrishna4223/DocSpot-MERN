// controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires authentication)
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id).select('-password'); // Exclude password

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty, // Will be undefined for customers/admins
      location: user.location,   // Will be undefined for customers/admins
      isApproved: user.isApproved,
    });
  } else {
    res.status(404); // Not Found
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (requires authentication)
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only update password if provided
    if (req.body.password) {
      user.password = req.body.password; // Pre-save hook will hash it
    }

    // Doctor specific fields update
    if (user.role === 'doctor') {
        user.specialty = req.body.specialty || user.specialty;
        user.location = req.body.location || user.location;
    }

    const updatedUser = await user.save(); // Save changes to the database

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      specialty: updatedUser.specialty,
      location: updatedUser.location,
      isApproved: updatedUser.isApproved,
    });
  } else {
    res.status(404); // Not Found
    throw new Error('User not found');
  }
});

module.exports = { getUserProfile, updateUserProfile };
