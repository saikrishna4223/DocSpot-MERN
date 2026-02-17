// client/src/components/DoctorCard.js
import React from 'react';
import { Button, Card, CardContent, Typography, Chip } from '@mui/material';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  return (
    <Card className="rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-blue-700 mb-2">{doctor.name}</Typography>
        <Typography variant="body2" color="text.secondary" className="mb-1">Specialty: <Chip label={doctor.specialty} size="small" color="primary" className="ml-2" /></Typography>
        <Typography variant="body2" color="text.secondary" className="mb-3">Location: {doctor.location}</Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onBookAppointment(doctor)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;