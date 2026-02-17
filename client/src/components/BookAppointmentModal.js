// client/src/components/BookAppointmentModal.js
import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

const BookAppointmentModal = ({ open, onClose, doctor, onBook }) => {
  const [selectedDateString, setSelectedDateString] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDocuments(event.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!selectedDateString || !selectedTime || !dateRegex.test(selectedDateString)) {
      setError('Please select a valid date (YYYY-MM-DD) and time.');
      return;
    }
    setError('');
    onBook({
      // --- FIX START ---
      doctorId: doctor._id, // <--- Use doctor._id here, as that's what MongoDB provides
      // --- FIX END ---
      date: selectedDateString,
      time: selectedTime,
      documents: documents ? [documents] : [],
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="bg-blue-600 text-white rounded-t-lg">Book Appointment with {doctor?.name}</DialogTitle>
      <DialogContent dividers className="py-6 space-y-5">
        <TextField
            label="Appointment Date (YYYY-MM-DD)"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedDateString}
            onChange={(e) => setSelectedDateString(e.target.value)}
            placeholder="e.g., 2025-07-30"
            required
            className="w-full"
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Time Slot</InputLabel>
          <Select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            label="Time Slot"
          >
            <MenuItem value="09:00 AM">09:00 AM</MenuItem>
            <MenuItem value="10:00 AM">10:00 AM</MenuItem>
            <MenuItem value="11:00 AM">11:00 AM</MenuItem>
            <MenuItem value="02:00 PM">02:00 PM</MenuItem>
            <MenuItem value="03:00 PM">03:00 PM</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          className="border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg py-3"
        >
          Upload Documents (Optional)
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {documents && (
          <Typography variant="body2" color="text.secondary">
            File selected: {documents}
          </Typography>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions className="p-4 bg-gray-50 rounded-b-lg">
        <Button onClick={onClose} className="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg">Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
        >
          Request Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookAppointmentModal;