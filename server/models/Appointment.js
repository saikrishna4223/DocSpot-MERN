// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model (customer)
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model (doctor)
    },
    date: {
      type: Date, // Store as Date object
      required: true,
    },
    time: {
      type: String, // E.g., "09:00 AM", "14:30 PM"
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending', // Initial status when a user requests an appointment
    },
    documents: [ // Array of strings, e.g., URLs to uploaded medical records
      {
        type: String,
      }
    ],
    doctorNotes: { // Notes added by the doctor after consultation
        type: String,
        default: '',
    },
    visitSummary: { // Summary provided to the patient after the appointment
        type: String,
        default: '',
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
