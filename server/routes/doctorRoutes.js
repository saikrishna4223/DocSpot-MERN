// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const {
  getApprovedDoctors,
  getDoctorById
} = require('../controllers/doctorController'); // Import both controller functions

// Public routes for doctors
router.get('/', getApprovedDoctors); // Route to get ALL approved doctors
router.get('/:id', getDoctorById); // Route to get a SINGLE doctor by ID

module.exports = router;