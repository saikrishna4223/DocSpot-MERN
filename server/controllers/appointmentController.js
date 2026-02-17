// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const bookAppointment = async (req, res, next) => {
  const { doctorId, date, time, documents } = req.body;
  const customerId = req.user._id;

  console.log('--- Book Appointment Attempt (Backend) ---');
  console.log('Customer ID (from token):', customerId.toString());
  console.log('Requested Doctor ID (from frontend):', doctorId);
  console.log('Requested Date:', date);
  console.log('Requested Time:', time);

  try {
    const doctor = await User.findById(doctorId);

    if (!doctor) {
      console.log('Book Appointment Error: Doctor not found with ID:', doctorId);
      res.status(404);
      return next(new Error('Doctor not found.'));
    }

    console.log('Book Appointment: Doctor found in DB:', doctor.email, 'Is Approved:', doctor.isApproved, 'Role:', doctor.role);

    if (doctor.role !== 'doctor' || !doctor.isApproved) {
      console.log('Book Appointment Error: Selected user is not an approved doctor.');
      res.status(400);
      return next(new Error('Selected doctor not found or not approved.'));
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ['pending', 'scheduled'] }
    });

    if (existingAppointment) {
      console.log('Book Appointment Error: Appointment conflict detected for doctor, date, time:', doctorId, date, time);
      res.status(400);
      return next(new Error('This appointment slot is already taken.'));
    }

    const appointment = await Appointment.create({
      customer: customerId,
      doctor: doctorId,
      date,
      time,
      documents: documents || [],
      status: 'pending',
    });

    if (appointment) {
      console.log('Book Appointment Success: Appointment created:', appointment._id);
      res.status(201).json({
        message: 'Appointment request submitted successfully. Waiting for doctor confirmation.',
        appointmentId: appointment._id,
      });
    } else {
      res.status(400);
      return next(new Error('Invalid appointment data'));
    }
  } catch (error) {
    console.error('Book Appointment Catch Error:', error);
    next(error);
  }
};

// @desc    Get appointments for the logged-in user (customer or doctor)
// @route   GET /api/appointments/myappointments
// @access  Private (Customer or Doctor)
const getMyAppointments = async (req, res, next) => {
  const user = req.user; // Authenticated user from protect middleware

  console.log('--- Get My Appointments Backend Call ---');
  console.log('User accessing appointments:', user.email, 'Role:', user.role, 'User ID:', user._id.toString());

  try {
    let appointments;
    if (user.role === 'customer') {
      console.log('Querying for customer appointments for ID:', user._id.toString());
      appointments = await Appointment.find({ customer: user._id })
                                       .populate('doctor', 'name specialty location');
    } else if (user.role === 'doctor') {
      console.log('Querying for doctor appointments for ID:', user._id.toString());
      appointments = await Appointment.find({ doctor: user._id })
                                       .populate('customer', 'name email'); // Populate only necessary fields
    } else {
      res.status(403);
      console.log('Get My Appointments Error: Unauthorized role trying to view appointments:', user.role);
      return next(new Error('Not authorized to view appointments.'));
    }

    console.log(`Backend: Found ${appointments.length} appointments for ${user.role} ${user.email}.`);
    if (appointments.length > 0) {
      console.log('Backend: First appointment details (to check population):', JSON.stringify(appointments[0], null, 2));
    } else {
      console.log('Backend: No appointments found for this user/doctor.');
    }

    res.json(appointments);
  } catch (error) {
    console.error('Get My Appointments Catch Error:', error);
    next(error);
  }
};

// @desc    Update appointment status (by doctor)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res, next) => {
  const { status, doctorNotes, visitSummary } = req.body;
  const appointmentId = req.params.id;
  const doctorId = req.user._id;

  console.log('--- Update Appointment Status (Backend) ---');
  console.log('Appointment ID:', appointmentId);
  console.log('Doctor ID (from token):', doctorId.toString());
  console.log('New Status:', status);

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      res.status(404);
      console.log('Update Appointment Error: Appointment not found with ID:', appointmentId);
      return next(new Error('Appointment not found'));
    }

    if (appointment.doctor.toString() !== doctorId.toString()) {
      res.status(401);
      console.log('Update Appointment Error: Not authorized to update this appointment. Doctor ID mismatch.');
      return next(new Error('Not authorized to update this appointment'));
    }

    appointment.status = status || appointment.status;
    appointment.doctorNotes = doctorNotes !== undefined ? doctorNotes : appointment.doctorNotes;
    appointment.visitSummary = visitSummary !== undefined ? visitSummary : appointment.visitSummary;

    const updatedAppointment = await appointment.save();
    console.log('Update Appointment Success: Appointment updated:', updatedAppointment._id);

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Update Appointment Catch Error:', error);
    next(error);
  }
};

// @desc    Cancel an appointment (by customer)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Customer)
const cancelAppointment = async (req, res, next) => {
  const appointmentId = req.params.id;
  const customerId = req.user._id;

  console.log('--- Cancel Appointment Attempt (Backend) ---');
  console.log('Appointment ID:', appointmentId);
  console.log('Customer ID (from token):', customerId.toString());

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      res.status(404);
      console.log('Cancel Appointment Error: Appointment not found with ID:', appointmentId);
      return next(new Error('Appointment not found'));
    }

    if (appointment.customer.toString() !== customerId.toString()) {
      res.status(401);
      console.log('Cancel Appointment Error: Not authorized to cancel this appointment. Customer ID mismatch.');
      return next(new Error('Not authorized to cancel this appointment'));
    }

    appointment.status = 'cancelled';
    const cancelledAppointment = await appointment.save();
    console.log('Cancel Appointment Success: Appointment cancelled:', cancelledAppointment._id);

    res.json({
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppointment,
    });
  } catch (error) {
    console.error('Cancel Appointment Catch Error:', error);
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};