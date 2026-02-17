// controllers/doctorController.js
// Removed: const asyncHandler = require('express-async-handler'); // REMOVE THIS LINE
const User = require('../models/User');

// @desc    Get all approved doctors
// @route   GET /api/doctors
// @access  Public (can be accessed by anyone to browse doctors)
const getApprovedDoctors = async (req, res, next) => { // Added 'next' parameter
  try { // Start try block
    // Find all users with role 'doctor' and isApproved: true
    const doctors = await User.find({ role: 'doctor', isApproved: true }).select('-password'); // Exclude passwords

    res.json(doctors);
  } catch (error) { // Catch block
    console.error('Error in getApprovedDoctors:', error);
    next(error); // Pass error to Express error handler
  }
};

// @desc    Get a single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => { // Added 'next' parameter
  try { // Start try block
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor', isApproved: true }).select('-password');

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404); // Not Found
      return next(new Error('Doctor not found or not approved')); // Pass error
    }
  } catch (error) { // Catch block
    console.error('Error in getDoctorById:', error);
    next(error); // Pass error to Express error handler
  }
};

module.exports = { getApprovedDoctors, getDoctorById };