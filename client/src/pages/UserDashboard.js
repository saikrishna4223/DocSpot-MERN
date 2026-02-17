// client/src/pages/UserDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import PageContainer from '../components/common/PageContainer';
import DoctorCard from '../components/DoctorCard';
import BookAppointmentModal from '../components/BookAppointmentModal';
import { AuthContext } from '../context/AuthContext';
import { backendApi } from '../services/api';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch APPROVED doctors from the backend
        const { data: fetchedDoctors } = await backendApi.getDoctors();
        console.log("Frontend: Fetched doctors for display:", fetchedDoctors); // Diagnostic log
        setDoctors(fetchedDoctors);

        // Only fetch user appointments if user is defined (after auth check)
        if (user && user._id) {
          console.log("Frontend (User Dashboard): Attempting to fetch appointments for user ID:", user._id); // Diagnostic log
          const { data: fetchedAppointments } = await backendApi.getUserAppointments();
          console.log("Frontend (User Dashboard): Successfully fetched appointments:", fetchedAppointments); // Diagnostic log
          setAppointments(fetchedAppointments);
        } else {
          console.log("Frontend (User Dashboard): User not available to fetch appointments."); // Diagnostic log
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
        console.error("Frontend: Error fetching data:", err.response?.data || err.message); // Diagnostic log
      }
    };
    fetchData();
  }, [user, message]); // Re-fetch data if user or message (from booking) changes

  const handleBookAppointmentClick = (doctor) => {
    setSelectedDoctor(doctor); // The entire doctor object is passed
    setIsModalOpen(true);
  };

  const handleBookAppointment = async (appointmentData) => {
    setMessage('');
    setError('');
    try {
      // Send appointment request to the backend
      const response = await backendApi.bookAppointment(appointmentData);
      setMessage(response.data.message);

      // Refresh appointments after successful booking
      if (user && user._id) {
        const { data: updatedAppointments } = await backendApi.getUserAppointments();
        setAppointments(updatedAppointments);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
      console.error("Frontend: Error booking appointment:", err.response?.data || err.message); // Diagnostic log
    }
  };

  // Helper to get doctor name from the 'doctors' state (fetched from backend)
  // This helper is a fallback. Ideally, appt.doctor will already be populated with the doctor object.
  const getDoctorName = (doctorId) => {
    console.log("getDoctorName: Looking for doctor with ID (fallback):", doctorId); // Diagnostic log
    // Ensure both IDs are converted to strings for reliable comparison
    const doctor = doctors.find(d => d._id?.toString() === doctorId?.toString());
    console.log("getDoctorName: Fallback found doctor:", doctor); // Diagnostic log
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <PageContainer maxWidth="lg">
      <Typography variant="h4" className="font-bold text-blue-700 mb-6 text-center">
        Welcome, {user?.name}! Your Dashboard
      </Typography>

      {message && <Box className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4" role="alert"><Typography>{message}</Typography></Box>}
      {error && <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert"><Typography>{error}</Typography></Box>}

      <Box className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
          Upcoming Appointments
        </Typography>
        {appointments.length > 0 ? (
          <Grid container spacing={3}>
            {appointments.map((appt) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id}>
                <Card className="rounded-lg shadow-md">
                  <CardContent>
                    <Typography variant="h6" className="font-medium text-blue-600">
                      {/* Fixed: Prioritize appt.doctor.name if populated, fallback to lookup by ID */}
                      {appt.doctor && typeof appt.doctor === 'object' ? appt.doctor.name : getDoctorName(appt.doctor)}
                    </Typography>
                    <Typography variant="body1">Date: {appt.date.split('T')[0]}</Typography>
                    <Typography variant="body1">Time: {appt.time}</Typography>
                    <Typography variant="body1" className="mb-2">Status: <Chip label={appt.status} size="small" color={appt.status === 'scheduled' ? 'success' : appt.status === 'pending' ? 'warning' : 'default'} /></Typography>

                    {/* NEW: Display Doctor Notes if available - STYLING IMPROVED */}
                    {appt.doctorNotes && (
                      <Typography variant="body2" className="text-gray-700 mt-2">
                        <span className="font-semibold">Doctor's Notes:</span> {appt.doctorNotes}
                      </Typography>
                    )}

                    {/* NEW: Display Visit Summary if available - STYLING IMPROVED */}
                    {appt.visitSummary && (
                      <Typography variant="body2" className="text-gray-700 mt-2">
                        <span className="font-semibold">Visit Summary:</span> {appt.visitSummary}
                      </Typography>
                    )}

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" className="text-gray-600">No upcoming appointments.</Typography>
        )}
      </Box>

      <Box className="p-6 bg-white rounded-xl shadow-lg">
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
          Available Doctors
        </Typography>
        <Grid container spacing={4}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doctor._id}>
              <DoctorCard doctor={doctor} onBookAppointment={handleBookAppointmentClick} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <BookAppointmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        onBook={handleBookAppointment}
      />
    </PageContainer>
  );
};

export default UserDashboard;
