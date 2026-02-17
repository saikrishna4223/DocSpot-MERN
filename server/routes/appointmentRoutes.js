// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
// REMOVED: const asyncHandler = require('express-async-handler'); // THIS LINE IS GONE

const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');

// Route for booking an appointment (customer only)
// Now bookAppointment function itself contains try/catch and passes error to next()
router.post('/', protect(['customer']), bookAppointment);

// Route for getting appointments for the logged-in user (customer or doctor)
router.get('/myappointments', protect(['customer', 'doctor']), getMyAppointments);

// Route for doctor to update appointment status
router.put('/:id/status', protect(['doctor']), updateAppointmentStatus);

// Route for customer to cancel an appointment
router.put('/:id/cancel', protect(['customer']), cancelAppointment);


module.exports = router;