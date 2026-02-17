// routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (require a valid JWT)
router.route('/profile')
  .get(protect, getUserProfile) // Get profile for the authenticated user
  .put(protect, updateUserProfile); // Update profile for the authenticated user

module.exports = router;
