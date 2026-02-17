// client/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import PageContainer from '../components/common/PageContainer';
import { backendApi } from '../services/api'; // <--- UPDATED: Import backendApi from api.js

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        // Fetch pending doctor approvals from the backend
        const { data: doctors } = await backendApi.getPendingDoctorApprovals(); // <--- UPDATED: Use backendApi.getPendingDoctorApprovals
        setPendingDoctors(doctors);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch pending doctors.');
      }
    };
    fetchPendingDoctors();
  }, [message]); // Re-fetch when message changes (after approval/rejection)

  const handleApprove = async (doctorId) => {
    setMessage('');
    setError('');
    try {
      // Send approval request to the backend
      const response = await backendApi.approveDoctor(doctorId); // <--- UPDATED: Use backendApi.approveDoctor
      setMessage(response.data.message);
      // Re-fetch pending doctors to update the list
      const { data: doctors } = await backendApi.getPendingDoctorApprovals();
      setPendingDoctors(doctors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve doctor.');
    }
  };

  const handleReject = async (doctorId) => {
    setMessage('');
    setError('');
    try {
      // Send rejection/delete request to the backend
      const response = await backendApi.rejectDoctor(doctorId); // <--- UPDATED: Use backendApi.rejectDoctor
      setMessage(response.data.message);
      // Re-fetch pending doctors to update the list
      const { data: doctors } = await backendApi.getPendingDoctorApprovals();
      setPendingDoctors(doctors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject doctor.');
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <Typography variant="h4" className="font-bold text-blue-700 mb-6 text-center">
        Admin Dashboard
      </Typography>

      {message && <Box className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4" role="alert"><Typography>{message}</Typography></Box>}
      {error && <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert"><Typography>{error}</Typography></Box>}

      <Box className="p-6 bg-white rounded-xl shadow-lg">
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
          Doctor Approval Requests
        </Typography>
        {pendingDoctors.length > 0 ? (
          <Grid container spacing={3}>
            {pendingDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor._id}> {/* Use _id from MongoDB */}
                <Card className="rounded-lg shadow-md">
                  <CardContent>
                    <Typography variant="h6" className="font-medium text-blue-600 mb-1">{doctor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Email: {doctor.email}</Typography>
                    <Typography variant="body2" color="text.secondary">Specialty: {doctor.specialty}</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-3">Location: {doctor.location}</Typography>
                    <Box className="mt-4 flex space-x-2">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(doctor._id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleReject(doctor._id)}
                        className="border-red-500 text-red-600 hover:bg-red-50 py-2 rounded-lg flex-1"
                      >
                        Reject
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" className="text-gray-600">No pending doctor approval requests.</Typography>
        )}
      </Box>
    </PageContainer>
  );
};

export default AdminDashboard;