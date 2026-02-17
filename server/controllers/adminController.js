// controllers/adminController.js
// const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all pending doctor approval requests
// @route   GET /api/admin/doctors/pending
// @access  Private (Admin)
const getPendingDoctorApprovals = async (req, res, next) => { // Added 'next'
  try { // Start try block
    const doctors = await User.find({ role: 'doctor', isApproved: false }).select('-password'); // Exclude password

    res.json(doctors);
  } catch (error) { // Catch block
    console.error('Error in getPendingDoctorApprovals:', error);
    next(error);
  }
};

// @desc    Approve a doctor's account
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin)
const approveDoctor = async (req, res, next) => { // Added 'next'
  try { // Start try block
    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      return next(new Error('Doctor not found'));
    }

    if (doctor.role !== 'doctor') {
      res.status(400);
      return next(new Error('User is not a doctor profile'));
    }

    doctor.isApproved = true; // Set to approved
    await doctor.save();

    res.json({ message: 'Doctor approved successfully', doctorId: doctor._id });
  } catch (error) { // Catch block
    console.error('Error in approveDoctor:', error);
    next(error);
  }
};

// @desc    Reject and delete a doctor's account
// @route   DELETE /api/admin/doctors/:id
// @access  Private (Admin)
const rejectDoctor = async (req, res, next) => { // Added 'next'
  try { // Start try block
    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      return next(new Error('Doctor not found'));
    }

    if (doctor.role !== 'doctor') {
      res.status(400);
      return next(new Error('User is not a doctor profile'));
    }

    await doctor.deleteOne(); // Use deleteOne() on the found document

    res.json({ message: 'Doctor rejected and removed successfully', doctorId: req.params.id });
  } catch (error) { // Catch block
    console.error('Error in rejectDoctor:', error);
    next(error);
  }
};

module.exports = {
  getPendingDoctorApprovals,
  approveDoctor,
  rejectDoctor,
};