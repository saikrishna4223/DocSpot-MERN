// client/src/pages/Auth/RegisterPage.js
import React, { useState } from 'react';
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageContainer from '../../components/common/PageContainer';
import { backendApi } from '../../services/api'; // <--- UPDATED: Import backendApi from api.js

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const userData = { name, email, password, role };
    if (role === 'doctor') {
      userData.specialty = specialty;
      userData.location = location;
    }

    try {
      // <--- UPDATED: Use backendApi.register
      const response = await backendApi.register(userData);
      setSuccess(response.data.message); // Backend sends message in response.data
      // Optional: auto-login customers, or redirect to login page
      // For doctors, they wait for approval.
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="sm" className="bg-white p-8 rounded-xl shadow-lg mt-10">
      <Typography variant="h4" className="text-center mb-6 font-bold text-blue-700">
        Register for DocSpot
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Full Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Register As</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Register As"
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
          </Select>
        </FormControl>

        {role === 'doctor' && (
          <>
            <TextField
              label="Specialty"
              fullWidth
              variant="outlined"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
            <TextField
              label="Location"
              fullWidth
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </>
        )}

        {error && (
          <Typography color="error" className="text-center text-red-600">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" className="text-center text-green-600">
            {success}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <Typography className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Button variant="text" onClick={() => window.location.hash = '#login'} className="text-blue-600 hover:underline">
            Login Here
          </Button>
        </Typography>
      </form>
    </PageContainer>
  );
};

export default RegisterPage;