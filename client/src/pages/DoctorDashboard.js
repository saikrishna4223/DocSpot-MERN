// client/src/pages/DoctorDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Typography, Box, Grid, Card, CardContent, Chip, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageContainer from '../components/common/PageContainer';
import { AuthContext } from '../context/AuthContext';
import { backendApi } from '../services/api';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingApptId, setEditingApptId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [visitSummary, setVisitSummary] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user && user._id) { // Ensure user is defined before fetching
          console.log("Frontend (Doctor Dashboard): Attempting to fetch appointments for user ID:", user._id);
          const { data: fetchedAppointments } = await backendApi.getDoctorAppointments();
          console.log("Frontend (Doctor Dashboard): Successfully fetched appointments:", fetchedAppointments);
          setAppointments(fetchedAppointments);
        } else {
          console.log("Frontend (Doctor Dashboard): User not available to fetch appointments.");
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments.');
        console.error("Frontend (Doctor Dashboard): Error fetching appointments:", err.response?.data || err.message);
      }
    };
    fetchAppointments();
  }, [user, message]); // Re-fetch if message changes (after status update) or user changes

  // Helper to get customer name from the populated appointment data
  // This assumes backend populates 'customer' field in appointment response
  const getCustomerName = (customerObj) => {
    console.log("getCustomerName called with:", customerObj); // Log customer object
    return customerObj ? customerObj.name : 'Unknown Customer';
  };

  const handleUpdateStatus = async (appointmentId) => {
    setMessage('');
    setError('');
    try {
      const response = await backendApi.updateAppointmentStatus(appointmentId, {
        status: newStatus,
        doctorNotes: doctorNotes,
        visitSummary: visitSummary
      });
      setMessage(response.data.message);
      setEditingApptId(null);
      setDoctorNotes('');
      setVisitSummary('');
      // Force re-fetch by updating message or directly calling fetchAppointments again
      // The dependency array [user, message] should trigger a re-fetch, but can explicitly call if needed
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment status.');
      console.error("Frontend (Doctor Dashboard): Error updating appointment status:", err.response?.data || err.message);
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <Typography variant="h4" className="font-bold text-blue-700 mb-6 text-center">
        Dr. {user?.name}'s Dashboard
      </Typography>

      {message && <Box className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4" role="alert"><Typography>{message}</Typography></Box>}
      {error && <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert"><Typography>{error}</Typography></Box>}

      <Box className="p-6 bg-white rounded-xl shadow-lg">
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
          Your Appointments
        </Typography>
        {appointments.length > 0 ? (
          <Grid container spacing={3}>
            {appointments.map((appt) => (
              <Grid item xs={12} md={6} key={appt._id}>
                <Card className="rounded-lg shadow-md">
                  <CardContent>
                    <Typography variant="h6" className="font-medium text-blue-600 mb-2">
                      Patient: {getCustomerName(appt.customer)}
                    </Typography>
                    <Typography variant="body1">Date: {appt.date.split('T')[0]}</Typography>
                    <Typography variant="body1">Time: {appt.time}</Typography>
                    <Typography variant="body1" className="mb-2">Status: <Chip label={appt.status} size="small" color={appt.status === 'scheduled' ? 'success' : appt.status === 'pending' ? 'warning' : 'default'} /></Typography>

                    {appt.documents.length > 0 && (
                      <Typography variant="body2" className="text-gray-600 mt-2">
                        Documents: {appt.documents.join(', ')} (mock files)
                      </Typography>
                    )}
                    {appt.doctorNotes && (
                      <Typography variant="body2" className="text-gray-600 mt-2">
                        Doctor's Notes: {appt.doctorNotes}
                      </Typography>
                    )}
                    {appt.visitSummary && (
                      <Typography variant="body2" className="text-gray-600 mt-2">
                        Visit Summary: {appt.visitSummary}
                      </Typography>
                    )}


                    {editingApptId === appt._id ? (
                      <Box className="mt-4 space-y-3">
                        <FormControl fullWidth variant="outlined" size="small">
                          <InputLabel>Update Status</InputLabel>
                          <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            label="Update Status"
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="rescheduled">Rescheduled</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Doctor Notes (Optional)"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={2}
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                        />
                         <TextField
                          label="Visit Summary (Optional)"
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={2}
                          value={visitSummary}
                          onChange={(e) => setVisitSummary(e.target.value)}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdateStatus(appt._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mr-2"
                        >
                          Save Update
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setEditingApptId(null)}
                          className="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => { setEditingApptId(appt._id); setNewStatus(appt.status); setDoctorNotes(appt.doctorNotes || ''); setVisitSummary(appt.visitSummary || ''); }}
                        className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        Manage Appointment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" className="text-gray-600">No appointments scheduled for you.</Typography>
        )}
      </Box>
    </PageContainer>
  );
};

export default DoctorDashboard;