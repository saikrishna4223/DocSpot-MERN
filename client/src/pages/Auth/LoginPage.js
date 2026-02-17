// client/src/pages/Auth/LoginPage.js
import React, { useState, useContext } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import PageContainer from '../../components/common/PageContainer';
import { AuthContext } from '../../context/AuthContext';
import { backendApi } from '../../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await backendApi.login(email, password);
      // --- FIX START ---
      // Backend sends _id, name, email, role, and token directly in response.data
      const { _id, name, email: userEmail, role, token } = response.data;

      // Pass the user object and token to the login function
      login({ _id, name, email: userEmail, role }, token);
      // --- FIX END ---

      // Redirect based on role
      switch (role) { // Use the 'role' directly from the destructured response
        case 'customer':
          window.location.hash = '#user-dashboard';
          break;
        case 'doctor':
          window.location.hash = '#doctor-dashboard';
          break;
        case 'admin':
          window.location.hash = '#admin-dashboard';
          break;
        default:
          window.location.hash = '#'; // Fallback
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="sm" className="bg-white p-8 rounded-xl shadow-lg mt-10">
      <Typography variant="h4" className="text-center mb-6 font-bold text-blue-700">
        Login to DocSpot
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg"
        />
        {error && (
          <Typography color="error" className="text-center text-red-600">
            {error}
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
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Typography className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Button variant="text" onClick={() => window.location.hash = '#register'} className="text-blue-600 hover:underline">
            Register Here
          </Button>
        </Typography>
      </form>
    </PageContainer>
  );
};

export default LoginPage;