// client/src/services/api.js
// This file handles all actual API calls to your backend server.
import axios from 'axios';

// Define the base URL for your backend API using an environment variable.
// During local development, it will default to localhost.
// In production build, process.env.REACT_APP_API_BASE_URL will be set by Render.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create an Axios instance with the base URL and default headers.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically include the JWT token in headers
// for all outgoing requests if a token exists in local storage.
api.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from local storage.
    // It's stored here after a successful login.
    const token = localStorage.getItem('token');
    if (token) {
      // Attach the token to the Authorization header in "Bearer <token>" format.
      // This is required by your backend's `protect` middleware.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle any request errors (e.g., network issues)
    return Promise.reject(error);
  }
);

// --- API Functions for Frontend Components to Use ---
// Each function here maps to a specific backend endpoint.

export const backendApi = { // Exported name changed to backendApi for clarity
  // User Authentication
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),

  // Doctors
  // Fetches a list of all APPROVED doctors
  getDoctors: () => api.get('/doctors'),

  // Appointments
  // Sends a request to book a new appointment
  bookAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  // Fetches appointments specific to the logged-in user (customer or doctor)
  // The backend will determine based on the JWT token (req.user)
  getUserAppointments: () => api.get(`/appointments/myappointments`), // Customer calls this
  getDoctorAppointments: () => api.get(`/appointments/myappointments`), // Doctor calls this

  // Updates an appointment's status (used by doctors)
  // newStatusData should be an object like: { status: 'new_status', doctorNotes: '...', visitSummary: '...' }
  updateAppointmentStatus: (appointmentId, newStatusData) => api.put(`/appointments/${appointmentId}/status`, newStatusData),
  // Cancels an appointment (used by customers)
  cancelAppointment: (appointmentId) => api.put(`/appointments/${appointmentId}/cancel`),

  // Admin Operations
  // Fetches all doctor accounts that are pending approval
  getPendingDoctorApprovals: () => api.get('/admin/doctors/pending'),
  // Approves a specific doctor's account
  approveDoctor: (doctorId) => api.put(`/admin/doctors/${doctorId}/approve`),
  // Rejects and removes a doctor's account
  rejectDoctor: (doctorId) => api.delete(`/admin/doctors/${doctorId}`),
  // Optionally, if needed for admin dashboard:
  // getAllUsers: () => api.get('/admin/users'),
  // getAllAppointments: () => api.get('/admin/appointments'),
};
